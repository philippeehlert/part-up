/**
 * Render budget properly
 *
 * @param {Partup} partup
 * @return {String}
 * @ignore
 */
var prettyBudget = function(partup) {
    var budget = partup['type_' + partup.type + '_budget'];
    if (partup.type === Partups.TYPE.COMMERCIAL) {
        return budget + ' ' + TAPi18n.__('pages-app-partup-unit-money-' + (partup.currency || 'EUR'));
    } else if (partup.type === Partups.TYPE.ORGANIZATION) {
        return budget + ' ' + TAPi18n.__('pages-app-partup-unit-hours');
    } else {
        return null;
    }
};

/*************************************************************/
/* Partial rendered */
/*************************************************************/
Template.app_partup_sidebar.onRendered(function() {
    var template = this;

    template.autorun(function() {
        var partup = Partups.findOne(template.data.partupId);
        if (!partup) return;

        var image = Images.findOne({_id: partup.image});
        if (!image) return;

        var focuspointElm = template.find('[data-partupcover-focuspoint]');
        template.focuspoint = new Focuspoint.View(focuspointElm, {
            x: mout.object.get(image, 'focuspoint.x'),
            y: mout.object.get(image, 'focuspoint.y')
        });
    });
});

/*************************************************************/
/* Partial helpers */
/*************************************************************/
Template.app_partup_sidebar.helpers({
    partup: function() {
        var partup = Partups.findOne(this.partupId);

        if (partup) {
            Partup.client.windowTitle.setContextName(partup.name);
        }

        return partup;
    },

    numberOfSupporters: function() {
        var partup = Partups.findOne(this.partupId);
        if (!partup) return '...';
        return partup.supporters ? partup.supporters.length : '0';
    },

    isSupporter: function() {
        var partup = Partups.findOne(this.partupId);
        var user = Meteor.user();
        if (!partup || !partup.supporters || !user) return false;
        return partup.supporters.indexOf(Meteor.user()._id) > -1;
    },

    isUpperInPartup: function() {
        var user = Meteor.user();
        if (!user) return false;
        var partup = Partups.findOne(this.partupId);
        if (!partup) return false;
        return partup.hasUpper(user._id);
    },

    isPendingPartner: function() {
        var user = Meteor.user();
        if (!user) return false;
        var partup = Partups.findOne(this.partupId);
        if (!partup) return false;
        return (partup.pending_partners || []).indexOf(user._id) > -1;
    },

    partupUppers: function() {
        var partup = Partups.findOne(this.partupId);
        if (!partup) return;

        var uppers = partup.uppers || [];
        if (!uppers || !uppers.length) return [];

        var users = Meteor.users.findMultiplePublicProfiles(uppers).fetch();
        users = lodash.sortBy(users, function(user) {
            return this.indexOf(user._id);
        }, uppers);

        return users;
    },

    partupSupporters: function() {
        var partup = Partups.findOne(this.partupId);
        if (!partup) return;

        var supporters = partup.supporters;
        if (!supporters || !supporters.length) return [];

        return Meteor.users.findMultiplePublicProfiles(supporters);
    },
    showTakePartButton: function(argument) {
        var user = Meteor.user();
        var partup = Partups.findOne(this.partupId);
        return !user || !partup || !partup.hasUpper(user._id);
    },
    statusText: function() {
        var partup = Partups.findOne(this.partupId);
        if (!partup) return '';

        var location = mout.object.get(partup, 'location.city') || mout.object.get(partup, 'location.country');
        var date = moment(partup.end_date).format('LL');

        if (partup.network_id) {
            var network = Networks.findOne({_id: partup.network_id});
        }

        var getPrivacyLabel = function(type, network) {
            var privacy = {
                text: 'everyone',
                open: true
            };

            var getTypeLabel = function(type, labels) {
                var fallbackLabels = {
                    6: TAPi18n.__('pages-app-partup-label-network-admins-default'),
                    7: TAPi18n.__('pages-app-partup-label-network-colleagues-default'),
                    8: TAPi18n.__('pages-app-partup-label-network-custom-a-default'),
                    9: TAPi18n.__('pages-app-partup-label-network-custom-b-default'),
                };

                if (!labels || !labels[type]) return fallbackLabels[type];

                return labels[type];
            };

            if (type === Partups.privacy_types.PUBLIC) {
                privacy.text = TAPi18n.__('pages-app-partup-privacy-label-public');
            } else if (type === Partups.privacy_types.PRIVATE) {
                privacy.open = false;
                privacy.text = TAPi18n.__('pages-app-partup-privacy-label-private');
            } else if (type === Partups.privacy_types.NETWORK_PUBLIC) {
                privacy.text = TAPi18n.__('pages-app-partup-privacy-label-network-public', {network: lodash.get(network, 'name', '-')});
            } else if (type === Partups.privacy_types.NETWORK_INVITE) {
                privacy.open = false;
                privacy.text = TAPi18n.__('pages-app-partup-privacy-label-network-invite', {network: lodash.get(network, 'name', '-')});
            } else if (type === Partups.privacy_types.NETWORK_CLOSED) {
                privacy.open = false;
                privacy.text = TAPi18n.__('pages-app-partup-privacy-label-network-closed', {network: lodash.get(network, 'name', '-')});
            } else if (type >= Partups.privacy_types.NETWORK_ADMINS) {
                privacy.open = false;
                privacy.text = TAPi18n.__('pages-app-partup-privacy-label-network-custom', {network: lodash.get(network, 'name', '-'), label: getTypeLabel(type, lodash.get(network, 'privacy_type_labels'))});
            }
            return privacy;
        };

        return {
            activeTill: date,
            location: location,
            privacy: getPrivacyLabel(partup.privacy_type, network)
        };
    },
    format: function () {
        return function (content) {
            return new Partup.client.message(content)
                .sanitize()
                .autoLink()
                .getContent();
        }
    }
});

function becomeSupporter(partupId) {
    Meteor.call('partups.supporters.insert', partupId, function(error, result) {
        if (error) {
            return;
        }

        analytics.track('became supporter', {
            partupId: partupId
        });
    });
}

/*************************************************************/
/* Partial events */
/*************************************************************/
Template.app_partup_sidebar.events({

    'click [data-joinsupporters]': function(event, template) {
        var partupId = template.data.partupId;

        if (Meteor.user()) {
            becomeSupporter(partupId);
        } else {
            Intent.go({
                route: 'login'
            }, function(user) {
                if (user) {
                    becomeSupporter(partupId);
                }
            });
        }
    },

    'click [data-leavesupporters]': function(event, template) {
        Meteor.call('partups.supporters.remove', template.data.partupId);
    },

    'click [data-open-takepart-popup]': function(event, template) {
        if (Meteor.user()) {
            Partup.client.popup.open({
                id: 'take-part'
            });
        } else {
            Intent.go({
                route: 'login'
            }, function(user) {
                if (user) {
                    Partup.client.popup.open({
                        id: 'take-part'
                    });
                }
            });
        }
    },

    'click [data-invite]': function(event, template) {
        event.preventDefault();
        var partupId = template.data.partupId;
        var partup = Partups.findOne({_id: partupId});
        Intent.go({
            route: 'partup-invite',
            params: {
                slug: partup.slug
            }
        });
    }
});

// jscs:disable
/**
 * Render a widget to view/edit a single network's uppers
 *
 * @module client-network-settings-uppers
 * @param {Number} networkSlug    the slug of the network whose uppers are rendered
 */
// jscs:enable
Template.NetworkSettingsPartups.onCreated(function() {
    var template = this;
    var userId = Meteor.userId();

    template.searchQuery = new ReactiveVar();
    template.reactiveLabel = new ReactiveVar(TAPi18n.__('network-settings-partups-search-label-empty'));

    template.subscription = template.subscribe('networks.one', template.data.networkSlug, {
        onReady: function() {
            var network = Networks.findOne({slug: template.data.networkSlug});
            template.networkId = network._id;
            if (!network) Router.pageNotFound('network');
            if (network.isClosedForUpper(userId)) Router.pageNotFound('network');
        }
    });
    template.subscribe('networks.one.partups', {slug: template.data.networkSlug});
});

Template.NetworkSettingsPartups.helpers({
    data: function() {
        var template = Template.instance();
        var network = Networks.findOne({slug: template.data.networkSlug});
        if (!network) return;

        var searchOptions = {
            network_id: network._id
        };
        var searchQuery = template.searchQuery.get();
        if (searchQuery) searchOptions.name = {$regex: searchQuery, $options: 'i'};
        var partups = Partups.find(searchOptions).fetch();
        template.reactiveLabel.set(TAPi18n.__('network-settings-partups-search-label-count', {count: partups.length}));

        var self = this;
        return {
            network: function() {
                return network;
            },
            partups: function() {
                return partups;
            },
            searchQuery: function() {
                return template.searchQuery.get();
            }
        };
    },
    form: function() {
        var template = Template.instance();
        return {
            searchInput: function() {
                return {
                    reactiveLabel: template.reactiveLabel,
                    reactiveSearchQuery: template.searchQuery,
                    reactivePlaceholder: new ReactiveVar(TAPi18n.__('network-settings-partups-search-placeholder'))
                };
            }
        };
    },
    partupPopupId: function() {
        return 'partup-' + this._id;
    },
    readablePrivacyType: function(type, network_id) {
        var partupNetwork = Networks.findOne({_id: network_id});
        if (!partupNetwork || !partupNetwork.privacy_type_labels) return '-';
        return {
            3: TAPi18n.__('networksettings-partups-privacy-type-label-public'),
            4: TAPi18n.__('networksettings-partups-privacy-type-label-invite'),
            5: TAPi18n.__('networksettings-partups-privacy-type-label-closed'),
            6: TAPi18n.__('networksettings-partups-privacy-type-label-admin', {label: ((partupNetwork.privacy_type_labels && partupNetwork.privacy_type_labels[6]) || TAPi18n.__('networksettings-partups-privacy-type-label-admin-default'))}),
            7: TAPi18n.__('networksettings-partups-privacy-type-label-collegue', {label: ((partupNetwork.privacy_type_labels && partupNetwork.privacy_type_labels[7]) || TAPi18n.__('networksettings-partups-privacy-type-label-collegue-default'))}),
            8: TAPi18n.__('networksettings-partups-privacy-type-label-custom-a', {label: ((partupNetwork.privacy_type_labels && partupNetwork.privacy_type_labels[8]) || TAPi18n.__('networksettings-partups-privacy-type-label-custom-a-default'))}),
            9: TAPi18n.__('networksettings-partups-privacy-type-label-custom-b', {label: ((partupNetwork.privacy_type_labels && partupNetwork.privacy_type_labels[9]) || TAPi18n.__('networksettings-partups-privacy-type-label-custom-b-default'))})
        }[type] || '-';
    }
});

Template.NetworkSettingsPartups.events({
    'click [data-toggle]': function(event) {
        event.preventDefault();
        $(event.currentTarget).next('[data-toggle-target]').toggleClass('pu-state-active');
        $('[data-toggle-target]').not($(event.currentTarget).next('[data-toggle-target]')[0]).removeClass('pu-state-active');
    },
    'click [data-edit]': function(event, template) {
        event.preventDefault();
        $(event.currentTarget).closest('[data-toggle-target]').toggleClass('pu-state-active');
        Partup.client.popup.open({
            id: 'partup-' + $(event.currentTarget).data('edit')
        });
    }
});

Template.NetworkSettingsPartups_form.helpers({
    partupPrivacyTypes: function(network_id) {
        var partupNetwork = Networks.findOne({_id: network_id});
        const types = [];

        if (partupNetwork.isPublic()) {
            types.push({
                value: Partups.privacy_types.NETWORK_PUBLIC,
                label: TAPi18n.__('networksettings-partups-privacy-type-popup-option-public'),
            });
        } else if (partupNetwork.isInvitational()) {
            types.push({
                value: Partups.privacy_types.NETWORK_INVITE,
                label: TAPi18n.__('networksettings-partups-privacy-type-popup-option-invite'),
            });
        } else if (partupNetwork.isClosed()) {
            types.push({
                value: Partups.privacy_types.NETWORK_PRIVATE,
                label: TAPi18n.__('networksettings-partups-privacy-type-popup-option-private'),
            });
        }

        types.push({
            value: Partups.privacy_types.NETWORK_ADMINS,
            label: TAPi18n.__('networksettings-partups-privacy-type-popup-option-admin', {label: ((partupNetwork.privacy_type_labels && partupNetwork.privacy_type_labels[6]) || TAPi18n.__('networksettings-partups-privacy-type-label-admin-default'))})
        });

        if (!partupNetwork) return types;

        if (partupNetwork.colleaguesRoleEnabled()) {
            types.push({
                value: Partups.privacy_types.NETWORK_COLLEAGUES,
                label: TAPi18n.__('networksettings-partups-privacy-type-popup-option-collegue', {label: ((partupNetwork.privacy_type_labels && partupNetwork.privacy_type_labels[7]) || TAPi18n.__('networksettings-partups-privacy-type-label-collegue-default'))})
            });
        }

        if (partupNetwork.customARoleEnabled()) {
            types.push({
                value: Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_A,
                label: TAPi18n.__('networksettings-partups-privacy-type-popup-option-custom-a', {label: ((partupNetwork.privacy_type_labels && partupNetwork.privacy_type_labels[8]) || TAPi18n.__('networksettings-partups-privacy-type-label-custom-a-default'))})
            });
        }

        if (partupNetwork.customBRoleEnabled()) {
            types.push({
                value: Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_B,
                label: TAPi18n.__('networksettings-partups-privacy-type-popup-option-custom-b', {label: ((partupNetwork.privacy_type_labels && partupNetwork.privacy_type_labels[9]) || TAPi18n.__('networksettings-partups-privacy-type-label-custom-b-default'))})
            });
        }

        if (partupNetwork.isInvitational() || partupNetwork.isClosed()) {
            types.push({
                value: Partups.privacy_types.NETWORK_PUBLIC,
                label: TAPi18n.__('networksettings-partups-privacy-type-popup-option-discoverable'),
            });
        }

        return types;
    },
});

Template.NetworkSettingsPartups_form.events({
    'click [data-dismiss]': function(event, template) {
        Partup.client.popup.close();
    },
    'click [data-save]': function(event, template) {
        event.preventDefault();
        var partupId = $(event.currentTarget).data('save');
        var privacyType = parseInt($('[data-partup-privacy]').val());

        Partup.client.prompt.confirm({
            title: TAPi18n.__('networksettings-partups-privacy-type-change-confirm-title'),
            message: TAPi18n.__('networksettings-partups-privacy-type-change-confirm-message'),
            confirmButton: TAPi18n.__('networksettings-partups-privacy-type-change-confirm-button-confirm'),
            cancelButton: TAPi18n.__('networksettings-partups-privacy-type-change-confirm-button-cancel'),
            onConfirm: function() {
                Meteor.call('partups.change_privacy_type', partupId, privacyType, function(error, res) {
                    if (error) {
                        return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
                    }

                    Partup.client.notify.success(TAPi18n.__('networksettings-partups-privacy-type-popup-save-success'));
                    Partup.client.popup.close();
                });
            }
        });
    }
});



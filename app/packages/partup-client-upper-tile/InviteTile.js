Template.InviteTile.onCreated(function() {
    var template = this;
    template.inviting = new ReactiveVar(false);
    template.loading = new ReactiveVar(true);
    template.reInviteSent = new ReactiveVar(false);
    template.subscribe('users.one', template.data.userId, {
        onReady: function() {
            template.loading.set(false);
        }
    });
    template.inviteType = new ReactiveVar('partup-invite');

    if (template.data.partupId) template.inviteType.set('partup-invite');
    if (template.data.partupId && template.data.activityId) template.inviteType.set('partup-activity-invite');
    if (template.data.networkSlug) template.inviteType.set('network-invite');
    template.searchQuery = new ReactiveVar(false);
    template.autorun(function() {
        var data = Template.currentData();
        template.searchQuery.set(data.highlight);
    });
});

Template.InviteTile.helpers({
    data: function() {
        var self = this;
        var template = Template.instance();
        var data = Template.currentData();
        var user = Meteor.users.findOne({_id: template.data.userId});
        var currentUser = Meteor.user();
        if (!user) return;
        var tags = user.profile.tags || [];

        return {
            user: function() {
                return user;
            },
            participationScore: function() {
                return User(user).getReadableScore();
            },
            searchQuery: function() {
                return template.searchQuery.get();
            },
            highlightText: function() {
                var text = template.searchQuery.get();
                var highlight = Partup.client.sanitize(text);
                var description = user.profile.description || '';
                var descriptionArray = Partup.client.strings.splitCaseInsensitive(description, highlight);
                if (descriptionArray.length <= 1) return description;

                var maxCharacters = 100 - highlight.length;
                var outputArray = Partup.client.strings.shortenLeftRight(description, highlight, maxCharacters);
                var outputText = outputArray.join('<span>' + highlight + '</span>');
                return outputText;
            },
            highlightTags: function() {
                var text = template.searchQuery.get();
                var highlightTags = [];
                var searchtags = text.split(' ');
                _.each(searchtags, function(searchtag) {
                    var stag = searchtag.toLowerCase();
                    _.each(tags, function(item) {
                        var tag = item.toLowerCase();
                        if (item.indexOf(stag) > -1) highlightTags.push(item);
                    });
                });

                tags.sort(function(first, second) {
                    var firstString = first.toLowerCase();
                    var secondString = second.toLowerCase();
                    var firstMatches = 0;
                    var secondMatches = 0;

                    _.each(highlightTags, function(item) {
                        var tag = item.toLowerCase();
                        if (firstString.indexOf(tag)) firstMatches++;
                        if (secondString.indexOf(tag)) secondMatches++;
                    });

                    return firstMatches - secondMatches;

                });

                return {
                    highlight: highlightTags,
                    tags: tags
                };
            },
            relevance: function() {
                var userPartups = user.upperOf || [];
                var userSupporter = user.supporterOf || [];
                var userNetworks = user.networks || [];
                var currentUserPartups = currentUser.upperOf || [];
                var currentUserNetworks = currentUser.networks || [];
                return {
                    partnerInSamePartupsCount: function() {
                        return _.intersection(userPartups, currentUserPartups).length;
                    },
                    memberOfSameNetworkCount: function() {
                        return _.intersection(userNetworks, currentUserNetworks).length;
                    },
                    supporterOfPartupsCurrentUserIsPartnerOfCount: function() {
                        return _.intersection(userSupporter, currentUserPartups).length;
                    },
                    partnerInThisPartup: function() {
                        return _.intersection([template.data.partupId], userPartups).length;
                    }
                };
            }
        };
    },
    state: function() {
        var template = Template.instance();
        var activity = Activities.findOne(template.data.activityId);
        var partup = Partups.findOne(template.data.partupId);
        var network = Networks.findOne({slug: template.data.networkSlug});
        var user = Meteor.users.findOne({_id: template.data.userId});
        return {
            inviteSent: function() {
                if (activity) return activity.isUpperInvited(user._id);
                if (partup) return partup.hasInvitedUpper(user._id);
                if (network) return network.isUpperInvited(user._id);
                return false;
            },
            alreadyPartner: function() {
                if (template.inviteType.curValue === 'partup-activity-invite') return false;
                if (partup) return User(user).isPartnerInPartup(partup._id);
                if (network) return network.hasMember(user._id);
                return false;
            },
            inviteLoadingForUser: function() {
                return template.inviting.get();
            },
            loading: function() {
                return template.loading.get();
            },
            inviteButtonType: function() {
                return 'data-' + template.inviteType.get();
            },
            reInviteSent: function() {
                return template.reInviteSent.get();
            }
        };
    }
});

Template.InviteTile.events({
    'click [data-partup-invite]': function(event, template) {
        var partupId = template.data.partupId;
        var partup = Partups.findOne(partupId);
        var invitingUserId = template.data.userId;
        var invitingUser = Meteor.users.findOne({_id: invitingUserId});
        var searchQuery = template.searchQuery.get() || '';

        if ($(event.currentTarget).attr('data-reinvite') === undefined) {
            if (User(invitingUser).isPartnerInPartup(partupId) || partup.hasInvitedUpper(invitingUserId)) return;
        }

        template.inviting.set(true);
        Meteor.call('partups.invite_existing_upper', partupId, invitingUserId, searchQuery, function(err) {
            template.inviting.set(false);
            template.reInviteSent.set(true);

            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }
        });
    },

    'click [data-partup-activity-invite]': function(event, template) {
        var activityId = template.data.activityId;
        var activity = Activities.findOne(activityId);
        var invitingUserId = template.data.userId;
        var invitingUser = Meteor.users.findOne({_id: invitingUserId});
        var searchQuery = template.searchQuery.get() || '';

        // if (User(invitingUser).isPartnerInPartup(template.data.partupId) || activity.isUpperInvited(invitingUserId)) return;

        template.inviting.set(true);
        Meteor.call('activities.invite_existing_upper', activityId, invitingUserId, searchQuery, function(err) {
            template.inviting.set(false);
            template.reInviteSent.set(true);

            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }
        });
    },

    'click [data-network-invite]': function(event, template) {
        var invitingUserId = template.data.userId;
        var network = Networks.findOne({slug: template.data.networkSlug});
        var searchQuery = template.searchQuery.get() || '';
        if ($(event.currentTarget).attr('data-reinvite') === undefined) {
            if (network.hasMember(invitingUserId) || network.isUpperInvited(invitingUserId)) return;
        }
        template.inviting.set(true);
        Meteor.call('networks.invite_existing_upper', network._id, invitingUserId, searchQuery, function(err) {
            template.inviting.set(false);
            template.reInviteSent.set(true);

            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }
        });
    }
});

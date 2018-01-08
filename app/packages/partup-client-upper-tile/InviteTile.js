Template.InviteTile.onCreated(function() {
  let template = this;
  template.inviting = new ReactiveVar(false);
  template.loading = new ReactiveVar(true);
  template.reInviteSent = new ReactiveVar(false);
  template.subscribe('users.one', template.data.userId, {
    onReady: function() {
      template.loading.set(false);
    },
  });
  template.inviteType = new ReactiveVar('partup-invite');

  if (template.data.partupId) template.inviteType.set('partup-invite');
  if (template.data.partupId && template.data.activityId) {
    template.inviteType.set('partup-activity-invite');
  }
  if (template.data.networkSlug) template.inviteType.set('network-invite');
  template.searchQuery = new ReactiveVar(false);
  template.autorun(function() {
    let data = Template.currentData();
    template.searchQuery.set(data.highlight);
  });
});

Template.InviteTile.helpers({
  data: function() {
    let self = this;
    let template = Template.instance();
    let data = Template.currentData();
    let user = Meteor.users.findOne({ _id: template.data.userId });
    let currentUser = Meteor.user();
    if (!user) return;
    let tags = user.profile.tags || [];

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
        let text = template.searchQuery.get();
        let highlight = Partup.client.sanitize(text);
        let description = user.profile.description || '';
        let descriptionArray = Partup.client.strings.splitCaseInsensitive(
          description,
          highlight
        );
        if (descriptionArray.length <= 1) return description;

        let maxCharacters = 100 - highlight.length;
        let outputArray = Partup.client.strings.shortenLeftRight(
          description,
          highlight,
          maxCharacters
        );
        let outputText = outputArray.join('<span>' + highlight + '</span>');
        return outputText;
      },
      highlightTags: function() {
        let text = template.searchQuery.get();
        let highlightTags = [];
        let searchtags = text.split(' ');
        _.each(searchtags, function(searchtag) {
          let stag = searchtag.toLowerCase();
          _.each(tags, function(item) {
            let tag = item.toLowerCase();
            if (item.indexOf(stag) > -1) highlightTags.push(item);
          });
        });

        tags.sort(function(first, second) {
          let firstString = first.toLowerCase();
          let secondString = second.toLowerCase();
          let firstMatches = 0;
          let secondMatches = 0;

          _.each(highlightTags, function(item) {
            let tag = item.toLowerCase();
            if (firstString.indexOf(tag)) firstMatches++;
            if (secondString.indexOf(tag)) secondMatches++;
          });

          return firstMatches - secondMatches;
        });

        return {
          highlight: highlightTags,
          tags: tags,
        };
      },
      relevance: function() {
        let userPartups = user.upperOf || [];
        let userSupporter = user.supporterOf || [];
        let userNetworks = user.networks || [];
        let currentUserPartups = currentUser.upperOf || [];
        let currentUserNetworks = currentUser.networks || [];
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
          },
        };
      },
    };
  },
  state: function() {
    let template = Template.instance();
    let activity = Activities.findOne(template.data.activityId);
    let partup = Partups.findOne(template.data.partupId);
    let network = Networks.findOne({ slug: template.data.networkSlug });
    let user = Meteor.users.findOne({ _id: template.data.userId });
    return {
      inviteSent: function() {
        if (activity) return activity.isUpperInvited(user._id);
        if (partup) return partup.hasInvitedUpper(user._id);
        if (network) return network.isUpperInvited(user._id);
        return false;
      },
      alreadyPartner: function() {
        if (template.inviteType.curValue === 'partup-activity-invite') {
          return false;
        }
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
      },
    };
  },
});

Template.InviteTile.events({
  'click [data-partup-invite]': function(event, template) {
    let partupId = template.data.partupId;
    let partup = Partups.findOne(partupId);
    let invitingUserId = template.data.userId;
    let invitingUser = Meteor.users.findOne({ _id: invitingUserId });
    let searchQuery = template.searchQuery.get() || '';

    if ($(event.currentTarget).attr('data-reinvite') === undefined) {
      if (
        User(invitingUser).isPartnerInPartup(partupId) ||
        partup.hasInvitedUpper(invitingUserId)
      ) {
        return;
      }
    }

    template.inviting.set(true);
    Meteor.call(
      'partups.invite_existing_upper',
      partupId,
      invitingUserId,
      searchQuery,
      function(err) {
        template.inviting.set(false);
        template.reInviteSent.set(true);

        if (err) {
          Partup.client.notify.error(err.reason);
          return;
        }
      }
    );
  },

  'click [data-partup-activity-invite]': function(event, template) {
    let activityId = template.data.activityId;
    let activity = Activities.findOne(activityId);
    let invitingUserId = template.data.userId;
    let invitingUser = Meteor.users.findOne({ _id: invitingUserId });
    let searchQuery = template.searchQuery.get() || '';

    // if (User(invitingUser).isPartnerInPartup(template.data.partupId) || activity.isUpperInvited(invitingUserId)) return;

    template.inviting.set(true);
    Meteor.call(
      'activities.invite_existing_upper',
      activityId,
      invitingUserId,
      searchQuery,
      function(err) {
        template.inviting.set(false);
        template.reInviteSent.set(true);

        if (err) {
          Partup.client.notify.error(err.reason);
          return;
        }
      }
    );
  },

  'click [data-network-invite]': function(event, template) {
    let invitingUserId = template.data.userId;
    let network = Networks.findOne({ slug: template.data.networkSlug });
    let searchQuery = template.searchQuery.get() || '';
    if ($(event.currentTarget).attr('data-reinvite') === undefined) {
      if (
        network.hasMember(invitingUserId) ||
        network.isUpperInvited(invitingUserId)
      ) {
        return;
      }
    }
    template.inviting.set(true);
    Meteor.call(
      'networks.invite_existing_upper',
      network._id,
      invitingUserId,
      searchQuery,
      function(err) {
        template.inviting.set(false);
        template.reInviteSent.set(true);

        if (err) {
          Partup.client.notify.error(err.reason);
          return;
        }
      }
    );
  },
});

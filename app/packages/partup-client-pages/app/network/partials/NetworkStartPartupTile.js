Template.NetworkStartPartupTile.helpers({
  data: function() {
    let template = Template.instance();
    let networkSlug = template.data.networkSlug;
    let network = Networks.findOne({ slug: networkSlug });
    let userId = Meteor.userId();

    return {
      currentUserCanCreatePartup: function() {
        if (network.startPartupRestrictedToAdmins()) {
          return network.isNetworkAdmin(userId);
        }
        return true;
      },
    };
  },
});

Template.NetworkStartPartupTile.events({
  'click [data-create-partup-in-tribe]': function(event, template) {
    event.preventDefault();

    let networkSlug = template.data.networkSlug;
    let network = Networks.findOne({ slug: networkSlug });

    Session.set('createPartupForNetworkById', network._id);

    Intent.go(
      { route: 'create-details', params: { slug: networkSlug } },
      function(slug) {
        if (slug) {
          Router.go('partup', {
            slug: slug,
          });
        } else {
          this.back();
        }
        Session.set('createPartupForNetworkById', false);
      }
    );
  },
  'click [data-start-chat-in-tribe]': function(event, template) {
    event.preventDefault();
    let currentUser = Meteor.userId();
    let networkSlug = template.data.networkSlug;
    let network = Networks.findOne({ slug: networkSlug });
    let adminForChat = network.admins[0];
    let admins = Meteor.users.findMultipleNetworkAdminProfiles(network.admins);

    // find online admin
    admins.forEach(function(user) {
      if (
        currentUser._id !== user._id && // can't start a chat with yourself
        user.status.online
      ) {
        adminForChat = user._id; // set adminForChat
        return;
      }
    });

    Meteor.call('chats.start_with_users', [adminForChat], function(
      err,
      chat_id
    ) {
      if (err) return Partup.client.notify.error('nope');
      if (template.view.isDestroyed) return;
      Router.go('/chats#' + chat_id);
    });
  },
});

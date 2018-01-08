/* 
 * 12-04-2017, Noel Heesen: Moved the leave network functionality to /partup-client-dropdowns/network-header/network-header.*
 */

Template.app_network_joinbutton.onCreated(function() {
  let template = this;
  template.joinToggle = new ReactiveVar(false);
});

Template.app_network_joinbutton.helpers({
  joinToggle: function() {
    return Template.instance().joinToggle.get();
  },
});

// The 'networks.joins' method handles the different possible states (uninvited or invited)
let joinNetworkOrAcceptInvitation = function(slug) {
  let network = Networks.findOne({ slug: slug });
  Meteor.call('networks.join', network._id, function(error) {
    if (error) {
      Partup.client.notify.error(error.reason);
    } else {
      Partup.client.notify.success('Joined network');

      analytics.track('joined network', {
        networkId: network._id,
      });
    }
  });
};

Template.app_network_joinbutton.events({
  'click [data-join]': function(event, template) {
    event.preventDefault();
    let user = Meteor.user();

    let proceed = function() {
      let network = template.data.network;
      Meteor.call('networks.join', network._id, function(error) {
        if (error) return Partup.client.notify.error(error.reason);
        template.joinToggle.set(!template.joinToggle.get());

        if (network.isClosed()) {
          Partup.client.notify.success(
            TAPi18n.__(
              'pages-app-network-notification-accepted_waitingforapproval'
            )
          );
        } else {
          Partup.client.notify.success(
            TAPi18n.__('pages-app-network-notification-joined')
          );
          analytics.track('joined network', {
            networkId: network._id,
          });
        }
      });
    };

    if (user) {
      proceed();
    } else {
      Intent.go({ route: 'login' }, function(loggedInUser) {
        if (loggedInUser) proceed();
        else {
          Partup.client.notify.error(
            TAPi18n.__('pages-app-network-notification-failed')
          );
        }
      });
    }
  },
  'click [data-accept]': function(event, template) {
    event.preventDefault();
    let proceedAccept = function(user) {
      let network = template.data.network;
      Meteor.call('networks.join', network._id, function(error) {
        if (error) return Partup.client.notify.error(error.reason);
        template.joinToggle.set(!template.joinToggle.get());
        if (!network.isClosed()) {
          Partup.client.notify.success(
            TAPi18n.__('pages-app-network-notification-joined')
          );
        }
      });
    };
    let user = Meteor.user();
    if (!user) {
      Intent.go({ route: 'login' }, function(loggedInUser) {
        if (loggedInUser) proceedAccept(loggedInUser);
        else {
          Partup.client.notify.error(
            TAPi18n.__('pages-app-network-notification-failed')
          );
        }
      });
      return;
    }
    proceedAccept(user);
  },
  'click [data-request-invite]': function(event, template) {
    event.preventDefault();

    let requestInvite = function() {
      let network = template.data.network;
      Meteor.call('networks.join', network._id, function(err) {
        if (err) {
          console.error(err);
          Partup.client.notify.error(TAPi18n.__(err));
        }
      });
    };

    if (Meteor.user()) {
      requestInvite();
    } else {
      Intent.go({ route: 'login' }, function() {
        requestInvite();
      });
    }
  },
});

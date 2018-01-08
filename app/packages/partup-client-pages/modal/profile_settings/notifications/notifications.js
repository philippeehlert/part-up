/**
 * Render profile email settings
 */
Template.modal_profile_settings_notifications.onCreated(function() {});

Template.modal_profile_settings_notifications.helpers({
  email: function() {
    let user = Meteor.user();
    return mout.object.get(user, 'profile.settings.email');
  },
  isSomeNetworkAdmin: function() {
    let user = Meteor.user();
    return User(user).isSomeNetworkAdmin();
  },
});

function saveEmailSettings(settingName, settingValue) {
  Meteor.call(
    'settings.update_email_notifications',
    settingName,
    settingValue,
    function(error) {
      if (error) {
        Partup.client.notify.error(error.reason);
        return;
      }
      if (settingValue) {
        Partup.client.notify.success(
          TAPi18n.__(
            'modal-profilesettings-email-updatesuccess-enabled-' + settingName
          )
        );
      }
      if (!settingValue) {
        Partup.client.notify.warning(
          TAPi18n.__(
            'modal-profilesettings-email-updatesuccess-disabled-' + settingName
          )
        );
      }
    }
  );
}

Template.modal_profile_settings_notifications.events({
  'click [data-enable]': function(e, template) {
    let settingName = $(e.currentTarget).data('enable');
    saveEmailSettings(settingName, true);
  },
  'click [data-disable]': function(e, template) {
    let settingName = $(e.currentTarget).data('disable');
    saveEmailSettings(settingName, false);
  },
});

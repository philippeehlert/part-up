Template.modal_profile_settings_email.onCreated(function() {
  let template = this;

  template.addEmail = new ReactiveVar(false);

  console.log(Meteor.user());

  template.callAddEmail = function(email) {
    Meteor.call('users.add_email', email, function(err, res) {
      if (err) return Partup.client.notify.error(err.message);
      Partup.client.notify.success(
        TAPi18n.__('modal-profilesettings-usermail-add-email-success')
      );
    });
  };

  template.callMakePrimary = function(emailIndex) {
    Partup.client.prompt.confirm({
      title: TAPi18n.__(
        'modal-profilesettings-usermail-set-primary-confirm-title'
      ),
      message: TAPi18n.__(
        'modal-profilesettings-usermail-set-primary-confirm-message'
      ),
      onConfirm: function() {
        Meteor.call('users.set_primary_email', emailIndex, function(err, res) {
          if (err) return Partup.client.notify.error(err.message);
          Partup.client.notify.success(
            TAPi18n.__('modal-profilesettings-usermail-set-primary-success')
          );
        });
      },
    });
  };

  template.callRemove = function(emailIndex) {
    Partup.client.prompt.confirm({
      title: TAPi18n.__('modal-profilesettings-usermail-remove-confirm-title'),
      message: TAPi18n.__(
        'modal-profilesettings-usermail-remove-confirm-message'
      ),
      onConfirm: function() {
        Meteor.call('users.remove_email', emailIndex, function(err, res) {
          if (err) return Partup.client.notify.error(err.message);
          Partup.client.notify.warning(
            TAPi18n.__('modal-profilesettings-usermail-remove-success')
          );
        });
      },
    });
  };
});

Template.modal_profile_settings_email.helpers({
  user: function() {
    return Meteor.user();
  },
  addEmail: function() {
    let template = Template.instance();
    return template.addEmail.get();
  },
  handlers: function() {
    let template = Template.instance();

    return {
      makePrimary: function() {
        return template.callMakePrimary;
      },
      remove: function() {
        return template.callRemove;
      },
    };
  },
});

Template.modal_profile_settings_email.events({
  'click [data-add-button]': function(event, template) {
    event.preventDefault();

    template.addEmail.set(true);
    lodash.defer(function() {
      $('[data-add-input]').focus();
    });
  },
  'blur [data-add-input]': function(event, template) {
    let newEmail = $(event.currentTarget).val();
    template.addEmail.set(false);
    if (newEmail) template.callAddEmail(newEmail);
  },
  'keyup [data-add-input]': function(event, template) {
    if (event.keyCode === 13) {
      $(event.currentTarget).blur();
    }
  },
});

Template.modal_profile_settings_email__manager.events({
  'click [data-button]': function(event, template) {
    event.preventDefault();
    template.data.onPrimary(template.data.params);
  },
  'click [data-button-2]': function(event, template) {
    event.preventDefault();
    template.data.onRemove(template.data.params);
  },
});

Template.modal_profile_settings_email__manager.helpers({
  has: function() {
    let template = Template.instance();
    return {
      primaryHandler: function() {
        return !!template.data.onPrimary;
      },
      removeHandler: function() {
        return !!template.data.onRemove;
      },
    };
  },
});

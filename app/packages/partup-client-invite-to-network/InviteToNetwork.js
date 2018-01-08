/**
 * Render invite to network functionality
 *
 * @module client-invite-to-network
 *
 */
Template.InviteToNetwork.onCreated(function() {
  let template = this;
  template.submitting = new ReactiveVar(false);
});

Template.InviteToNetwork.helpers({
  form: function() {
    let template = Template.instance();
    let network = Networks.findOne(template.data.networkId);
    let user = Meteor.user();
    return {
      schema: Partup.schemas.forms.inviteUpper,
      doc: function() {
        return {
          message: TAPi18n.__('invite-to-network-popup-message-prefill', {
            networkName: network.name,
            networkDescription: network.description,
            inviterName: Meteor.user().profile.name,
          }),
        };
      },
      classNames: function() {
        let cNames = 'pu-form';
        if (!template.data.nopopup) cName += ' pu-form-popup';
        return cNames;
      },
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      submitting: function() {
        return template.submitting.get();
      },
    };
  },
});

AutoForm.hooks({
  inviteToNetworkForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;
      let template = self.template.parent();

      let parent = Template.instance().parent();
      parent.submitting.set(true);

      Meteor.call(
        'networks.invite_by_email',
        template.data.networkId,
        insertDoc,
        function(error, result) {
          parent.submitting.set(false);
          if (error) {
            return Partup.client.notify.error(
              TAPi18n.__('base-errors-' + error.reason)
            );
          }
          Partup.client.notify.success(
            TAPi18n.__('invite-to-network-popup-success')
          );
          Partup.client.popup.close();
        }
      );

      return false;
    },
  },
});

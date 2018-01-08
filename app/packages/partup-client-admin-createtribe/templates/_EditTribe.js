/**
 */
Template._EditTribe.onCreated(function() {
  let template = this;
  template.submitting = new ReactiveVar(false);
});

Template._EditTribe.helpers({
  formSchema: Partup.schemas.forms.networkEdit,
  fieldsFromNetworkAdmin: function() {
    let network = Networks.findOne({
      slug: Template.instance().data.networkSlug,
    });
    return Partup.transformers.network.toFormNetworkAdmin(network);
  },
  submitting: function() {
    return Template.instance().submitting.get();
  },
  networkSlug: function() {
    return Template.instance().data.networkSlug;
  },
});

AutoForm.hooks({
  editTribeForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;
      let template = self.template.parent();

      let parent = Template.instance().parent();
      parent.submitting.set(true);

      Meteor.call(
        'networks.admin_update',
        template.data.networkSlug,
        insertDoc,
        function(error, result) {
          parent.submitting.set(false);
          if (error) {
            return Partup.client.notify.error(
              TAPi18n.__('base-errors-' + error.reason)
            );
          }
          Partup.client.popup.close();
        }
      );

      return false;
    },
  },
});

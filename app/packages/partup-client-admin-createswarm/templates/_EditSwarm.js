/**
 */
Template._EditSwarm.onCreated(function() {
  let template = this;
  template.submitting = new ReactiveVar(false);
});

Template._EditSwarm.helpers({
  formSchema: Partup.schemas.forms.swarmEditAdmin,
  submitting: function() {
    return Template.instance().submitting.get();
  },
  swarmSlug: function() {
    return Template.instance().data.swarmSlug.get();
  },
});

AutoForm.hooks({
  editSwarmForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;
      let template = self.template.parent();

      let parent = Template.instance().parent();
      parent.submitting.set(true);

      Meteor.call(
        'swarms.admin_update',
        template.data.swarmSlug.get(),
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

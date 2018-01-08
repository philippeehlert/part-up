Template._EditSector.onCreated(function() {
  this.submitting = new ReactiveVar(false);
});

Template._EditSector.helpers({
  formSchema: Partup.schemas.forms.sector,
  currentSectorFields: () =>
    Sectors.findOne({ _id: Template.instance().data.sectorId }),
  submitting: () => Template.instance().submitting.get(),
});

AutoForm.hooks({
  editSectorForm: {
    // Autoform can not handle ES6 because it uses 'this'
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this; // Required!
      let template = self.template.parent();
      let parent = Template.instance().parent();
      parent.submitting.set(true);

      Meteor.call(
        'sectors.update',
        template.data.sectorId,
        insertDoc,
        (error, result) => {
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

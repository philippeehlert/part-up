Template.app_partup_takepart.onCreated(function() {
  this.submitting = new ReactiveVar(false);
});

Template.app_partup_takepart.helpers({
  partup: function() {
    return Partups.findOne({ _id: this.partupId });
  },
  form: function() {
    return {
      schema: Partup.schemas.forms.updateComment,
    };
  },
  submitting: function() {
    return Template.instance().submitting.get();
  },
});

Template.app_partup_takepart.events({
  'click [data-submit-no-motivation]': function(event, template) {
    Meteor.call('partups.partner_request', template.data.partupId, function(
      error
    ) {
      if (error) {
        return Partup.client.notify.error(
          TAPi18n.__('base-errors-' + error.reason)
        );
      }
      Partup.client.notify.success(
        TAPi18n.__('partup-partner-request-popup-success')
      );
      Partup.client.popup.close();
    });
  },
});

AutoForm.hooks({
  becomePartnerForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;
      let template = self.template.parent();

      let parent = Template.instance().parent();
      parent.submitting.set(true);

      Meteor.call('partups.partner_request', template.data.partupId, function(
        error,
        updateId
      ) {
        if (error) {
          return Partup.client.notify.error(
            TAPi18n.__('base-errors-' + error.reason)
          );
        }

        if (!updateId) {
          // Upper is already partner
          parent.submitting.set(false);
          Partup.client.popup.close();
        }

        insertDoc.type = 'motivation';

        Meteor.call('updates.comments.insert', updateId, insertDoc, function(
          error,
          result
        ) {
          if (error) {
            return Partup.client.notify.error(
              TAPi18n.__('base-errors-' + error.reason)
            );
          }

          parent.submitting.set(false);
        });

        Partup.client.notify.success(
          TAPi18n.__('partup-partner-request-popup-success')
        );
        Partup.client.popup.close();
      });

      return false;
    },
  },
});

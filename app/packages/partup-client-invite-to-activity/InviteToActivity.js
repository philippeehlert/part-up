/**
 * Render invite to part-up activity functionality
 *
 * @module client-invite-to-partup-activity
 *
 */
Template.InviteToActivity.onCreated(function() {
  let template = this;
  template.submitting = new ReactiveVar(false);
});

Template.InviteToActivity.helpers({
  form: function() {
    let template = Template.instance();
    let activity = Activities.findOne(template.data.activityId);
    let partup = Partups.findOne(activity.partup_id);
    return {
      schema: Partup.schemas.forms.inviteUpper,
      doc: function() {
        return {
          message: TAPi18n.__('invite-to-activity-popup-message-prefill', {
            partupName: partup.name,
            activityName: activity.name,
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
  inviteToActivityForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;
      let template = self.template.parent();

      let parent = Template.instance().parent();
      parent.submitting.set(true);

      Meteor.call(
        'activities.invite_by_email',
        template.data.activityId,
        insertDoc,
        function(error, result) {
          parent.submitting.set(false);
          if (error) {
            return Partup.client.notify.error(
              TAPi18n.__('base-errors-' + error.reason)
            );
          }
          Partup.client.notify.success(
            TAPi18n.__('invite-to-activity-popup-success')
          );
          Partup.client.popup.close();
        }
      );

      return false;
    },
  },
});

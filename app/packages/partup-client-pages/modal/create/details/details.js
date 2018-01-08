let FORM_ID = 'createPartupForm';

Template.modal_create_details.onCreated(function() {
  let partupId = Session.get('partials.create-partup.current-partup');
  if (partupId) {
    this.subscribe('partups.one', partupId);
  }

  this.submitting = new ReactiveVar(false);
});

/** ***********************************************************/
/* Widget helpers */
/** ***********************************************************/
Template.modal_create_details.helpers({
  currentPartup: function() {
    let partupId = Session.get('partials.create-partup.current-partup');
    let partup = Partups.findOne({ _id: partupId });
    if (!partup) return undefined;

    return partup;
  },
  submittingSkip: function() {
    return Template.instance().submitting.get() === 'skip';
  },
  submittingNext: function() {
    return Template.instance().submitting.get() === 'next';
  },
  submitting: function() {
    return !!Template.instance().submitting.get();
  },
  isCreate: function() {
    return !Session.get('partials.create-partup.current-partup');
  },
});

/** ***********************************************************/
/* Widget events */
/** ***********************************************************/
Template.modal_create_details.events({
  'click [data-submission-type]': function eventClickSetSubmissionType(
    event,
    template
  ) {
    let button = event.currentTarget;
    let submissionType = button.getAttribute('data-submission-type');
    Session.set('partials.create-partup.submission-type', submissionType);

    if (button.type !== 'submit') {
      let form = template.find('#' + FORM_ID);
      $(form).submit();
    }
  },
});

/** ***********************************************************/
/* Widget create partup */
/** ***********************************************************/
let createOrUpdatePartup = function createOrUpdatePartup(
  partupId,
  insertDoc,
  callback,
  self
) {
  if (partupId) {
    // Partup already exists. Update.
    Meteor.call('partups.update', partupId, insertDoc, function(error, partup) {
      if (error && error.reason) {
        Partup.client.notify.error(error.reason);
        AutoForm.validateForm(self.formId);
        self.done(new Error(error.message));
        return;
      }

      callback(partup);
    });
  } else {
    // Partup does not exists yet. Insert.
    Meteor.call('partups.insert', insertDoc, function(error, partup) {
      if (error && error.reason) {
        Partup.client.notify.error(error.reason);
        AutoForm.validateForm(self.formId);
        self.done(new Error(error.message));
        return;
      }
      callback(partup);
      Session.set('partials.create-partup.current-partup', partup._id);

      analytics.track('Part-up created', {
        partupId: partup._id,
        userId: Meteor.user()._id,
      });
    });
  }
};

/** ***********************************************************/
/* Widget form hooks */
/** ***********************************************************/
let afHooks = {};
afHooks[FORM_ID] = {
  onError: Partup.client.scroll.scrollToAndFocusErrorField,
  onSubmit: function(insertDoc) {
    let self = this;
    let submissionType =
      Session.get('partials.create-partup.submission-type') || 'next';

    let template = self.template.parent().parent();
    template.submitting.set(submissionType);

    let possiblyExistingPartupId = Session.get(
      'partials.create-partup.current-partup'
    );
    createOrUpdatePartup(
      possiblyExistingPartupId,
      insertDoc,
      function(partup) {
        Router.go('create-activities', {
          _id: partup._id,
          slug: template.data.networkSlug,
        });
        Session.set('createPartupForNetworkById', false);
      },
      self
    );

    this.event.preventDefault();
    return false;
  },
};
AutoForm.hooks(afHooks);

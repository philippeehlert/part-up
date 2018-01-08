// jscs:disable
/**
 * Render forgotpassword functionality
 *
 * @module client-forgotpassword
 *
 */
// jscs:enable
let placeholders = {
  email: function() {
    return TAPi18n.__('forgotpassword-form-email-placeholder');
  },
};

/** ***********************************************************/
/* Widget initial */
/** ***********************************************************/
let resetSentSuccessful = new ReactiveVar(false);

/** ***********************************************************/
/* Page helpers */
/** ***********************************************************/
Template.Forgotpassword.helpers({
  formSchema: Partup.schemas.forms.forgotPassword,
  placeholders: placeholders,
  resetSentSuccessful: function() {
    return resetSentSuccessful.get();
  },
});

/** ***********************************************************/
/* Widget form hooks */
/** ***********************************************************/
AutoForm.hooks({
  forgotPasswordForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;

      Accounts.forgotPassword({ email: insertDoc.email }, function(error) {
        // Error cases
        if (error && error.message) {
          switch (error.message) {
            case 'User not found [403]':
              Partup.client.forms.addStickyFieldError(
                self,
                'email',
                'emailNotFound'
              );
              break;
            default:
              Partup.client.notify.error(error.reason);
          }
          AutoForm.validateForm(self.formId);
          self.done(new Error(error.message));
          return false;
        }

        // Success
        self.done();
        resetSentSuccessful.set(true);
      });

      return false;
    },
  },
});

// jscs:disable
/**
 * Render reset password form
 *
 * @module client-resetpassword
 */
// jscs:enable
let placeholders = {
  email: function() {
    return TAPi18n.__('resetpassword-form-email-placeholder');
  },
  password: function() {
    return TAPi18n.__('resetpassword-form-password-placeholder');
  },
  confirmPassword: function() {
    return TAPi18n.__('resetpassword-form-confirmPassword-placeholder');
  },
};

/** ***********************************************************/
/* Page helpers */
/** ***********************************************************/
Template.Resetpassword.helpers({
  formSchema: Partup.schemas.forms.resetPassword,
  placeholders: placeholders,
});

/** ***********************************************************/
/* Widget form hooks */
/** ***********************************************************/
AutoForm.hooks({
  resetPasswordForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;

      let parentTemplate = self.template.parent();

      let token = parentTemplate.data.token;
      Accounts.resetPassword(token, insertDoc.password, function(error) {
        if (error && error.message) {
          switch (error.message) {
            // case 'User not found [403]':
            //     Partup.client.forms.addStickyFieldError(self, 'email', 'emailNotFound');
            //     break;
            case 'Token expired [403]':
              Partup.client.notify.error(
                TAPi18n.__('resetpassword-form-token-expired')
              );
              break;
            default:
              Partup.client.notify.error(error.reason);
          }
          AutoForm.validateForm(self.formId);
          self.done(new Error(error.message));
          return false;
        }

        self.done();
        Intent.return('reset-password', {
          fallback_route: {
            name: 'login',
          },
        });
      });

      return false;
    },
  },
});

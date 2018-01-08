/**
 * Login Form
 * @name login
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.login = new SimpleSchema({
  email: {
    type: String,
    max: 255,
    regEx: SimpleSchema.RegEx.Email,
  },
  password: {
    type: String,
    max: 255,
  },
});

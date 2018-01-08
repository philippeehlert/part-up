// jscs:disable
/**
 * Render login form functionality
 *
 * @module client-login
 *
 */
// jscs:enable

let isChrome = navigator.userAgent.match('CriOS');

let formPlaceholders = {
  email: function() {
    return TAPi18n.__('login-form-email-placeholder');
  },
  password: function() {
    return TAPi18n.__('login-form-password-placeholder');
  },
};

if (isChrome) {
  // Success callback when using loginStyle: redirect
  Accounts.onLogin(function() {
    if (Router && Router.current().route.getName() === 'login') {
      Router.go('discover');
    }
  });

  // Failure callback when using loginStyle: redirect
  Accounts.onLoginFailure(function() {
    if (Router && Router.current().route.getName() === 'login') {
      Router.go('discover');
    }
  });
}

let submitting = new ReactiveVar(false);
let facebookLoading = new ReactiveVar(false);
let linkedinLoading = new ReactiveVar(false);

Template.Login.onCreated(function() {
  submitting.set(false);
  facebookLoading.set(false);
  linkedinLoading.set(false);
});

/** ***********************************************************/
/* Widget helpers */
/** ***********************************************************/
Template.Login.helpers({
  formSchema: Partup.schemas.forms.login,
  placeholders: formPlaceholders,
  submitting: function() {
    return submitting.get();
  },
  facebookLoading: function() {
    return facebookLoading.get();
  },
  linkedinLoading: function() {
    return linkedinLoading.get();
  },
});

/** ***********************************************************/
/* Widget events */
/** ***********************************************************/
Template.Login.events({
  'click [data-createaccount]': function(event) {
    event.preventDefault();
    Intent.go(
      { route: 'register' },
      function() {
        if (Meteor.user()) {
          continueLogin();
        } else {
          this.back();
        }
      },
      { prevent_going_back: true }
    );
  },
  'click [data-loginfacebook]': function(event) {
    event.preventDefault();

    facebookLoading.set(true);

    Meteor.loginWithFacebook(
      {
        requestPermissions: ['email'],
        loginStyle: isChrome ? 'redirect' : 'popup',
      },
      function(error) {
        facebookLoading.set(false);

        if (error) {
          Partup.client.notify.error(
            TAPi18n.__(
              'login-error_' + Partup.client.strings.slugify(error.reason)
            )
          );
          return;
        }

        continueLogin();
      }
    );
  },
  'click [data-loginlinkedin]': function(event) {
    event.preventDefault();

    linkedinLoading.set(true);

    Meteor.loginWithLinkedin(
      {
        requestPermissions: ['r_emailaddress'],
        loginStyle: isChrome ? 'redirect' : 'popup',
      },
      function(error) {
        linkedinLoading.set(false);

        if (error) {
          Partup.client.notify.error(
            TAPi18n.__(
              'login-error_' + Partup.client.strings.slugify(error.reason)
            )
          );
          return false;
        }

        continueLogin();
      }
    );
  },
});

/** ***********************************************************/
/* Widget functions */
/** ***********************************************************/
var continueLogin = function() {
  let user = Meteor.user();
  if (!user) return;

  let partupId = Session.get('partup_access_token_for_partup');
  let partupAccessToken = Session.get('partup_access_token');
  if (partupId && partupAccessToken) {
    Meteor.call(
      'partups.convert_access_token_to_invite',
      partupId,
      partupAccessToken
    );
  }

  let networkSlug = Session.get('network_access_token_for_network');
  let networkAccessToken = Session.get('network_access_token');
  if (networkSlug && networkAccessToken) {
    Meteor.call(
      'networks.convert_access_token_to_invite',
      networkSlug,
      networkAccessToken
    );
  }

  // Return if intent callback is present
  Intent.return('login', {
    arguments: [user],
    fallback_action: function() {
      if (mout.object.get(user, 'profile.settings.optionalDetailsCompleted')) {
        Router.go('discover');
      } else {
        Intent.go({ route: 'register-details' }, function() {
          Router.go('discover');
        });
      }
    },
  });
};

/** ***********************************************************/
/* Widget form hooks */
/** ***********************************************************/
AutoForm.hooks({
  loginForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;

      submitting.set(true);

      Meteor.loginWithPassword(insertDoc.email, insertDoc.password, function(
        error
      ) {
        submitting.set(false);

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
            case 'Incorrect password [403]':
              Partup.client.forms.addStickyFieldError(
                self,
                'password',
                'passwordIncorrect'
              );
              break;
            default:
              Partup.client.notify.error(
                TAPi18n.__(
                  'login-error_' + Partup.client.strings.slugify(error.reason)
                )
              );
          }
          AutoForm.validateForm(self.formId);
          self.done(new Error(error.message));
          return false;
        }

        // Success
        self.done();
        continueLogin();
      });

      return false;
    },
  },
});

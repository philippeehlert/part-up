// jscs:disable
/**
 * Render oauth grant functionality
 *
 * @module client-oauth
 *
 */
// jscs:enable

Template.OAuth.onCreated(function() {
  let template = this;
  template.submitting = new ReactiveVar(false);
  template.app = new ReactiveVar(null);
  Meteor.call('oauth.applications.find', template.data.clientId, function(
    error,
    result
  ) {
    if (!error) {
      template.app.set(result);
    }
  });
});

Template.OAuth.events({
  'click #authButton': function() {
    let template = Template.instance();
    console.log('client id: ' + template.data.clientId);
    template.submitting.set(true);
    Meteor.call(
      'oauth.grant',
      template.data.clientId,
      template.data.state,
      function(error, url) {
        template.submitting.set(false);
        if (!error) {
          window.location = url;
        }
      }
    );
  },
});

Template.OAuth.helpers({
  attrs: function() {
    let obj = {};
    if (Template.instance().submitting.get()) {
      obj.disabled = 'disabled';
    }
    return obj;
  },
  app: function() {
    return Template.instance().app.get();
  },
});

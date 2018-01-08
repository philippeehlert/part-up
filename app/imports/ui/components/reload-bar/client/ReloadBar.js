import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import './ReloadBar.html';

Tracker.autorun(function() {
  let $reloadBar = jQuery('#reload-bar');

  if (Session.get('puWantsToReload')) {
    $reloadBar.show();
  } else {
    $reloadBar.hide();
  }
});

Template.ReloadBar.onRendered(function() {
  let $reloadBar = jQuery('#reload-bar');

  if (Session.get('puWantsToReload')) {
    $reloadBar.show();
  } else {
    $reloadBar.hide();
  }
});

Template.ReloadBar.events({
  'click .rb-enable': function(event) {
    event.preventDefault();
    location.reload(true);
  },
});

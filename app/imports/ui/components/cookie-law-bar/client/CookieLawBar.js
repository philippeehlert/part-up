import {Template} from 'meteor/templating';
import {$} from 'meteor/jquery';
import {_} from 'meteor/underscore';

import { Session } from 'meteor/session';
import * as Cookies from './cookies.min';
import {waitUntil} from './wait-until';
import './CookieLawBar.html';


Template.CookieLawBar.onRendered(function () {
  var $cookiebar = jQuery('#cookie-bar');
  var $intercomLauncher = jQuery('#intercom-launcher');

  Session.set('cookiesEnabled', Cookies.get('cb-enabled'))
  if (Cookies.get('cb-enabled') && Cookies.get('cb-enabled') === 'enabled') {
    $cookiebar.hide();
  } else {
    $cookiebar.show();
  }

  waitUntil(function () {
    return (jQuery('#intercom-launcher').is(':visible') && jQuery('#cookie-bar').is(':visible'));
  }, function () {
    jQuery('#intercom-launcher').css({bottom: 80});
  }, function () {

  });

});

Template.CookieLawBar.events({
  'click .cb-enable': function (event) {
    var $cookiebar = jQuery(event.currentTarget).parent();
    Cookies.set('cb-enabled', 'enabled', {expires: Infinity});
    Session.set('cookiesEnabled', 'enabled')
    $cookiebar.hide();
    jQuery('#intercom-launcher').css({bottom: 20});
    event.preventDefault();
  }
});

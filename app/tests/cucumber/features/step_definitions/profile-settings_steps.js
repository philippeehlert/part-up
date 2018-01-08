'use strict';

import authentication from '../helpers/authentication';
import navigator from '../helpers/navigator';
import locators from '../helpers/locators';
import cookiebar from '../helpers/cookiebar';

let profileDropdownButton = '.pu-button-avatar';
let nameInput = '[name="name"]';
let descriptionTextarea = '[name="description"]';
let closeButton = '.pu-button-header-modal';
// let myProfileButton = '.pu-button-header-nostripe';

module.exports = function() {
  this.Given(/^The user logs in as Judy on the login page "([^"]*)"$/, function(
    loginUrl
  ) {
    navigator.gotoPage(loginUrl);
    authentication.loginAsJudy();
    cookiebar.postCookie();
  });

  this.When(/^Click the profile avatar$/, function() {
    browser.waitForExist(profileDropdownButton);
    browser.click(profileDropdownButton);
    browser.waitForExist('.pu-button-header-profiledropdown-active');
  });

  this.When(/^Click Settings$/, function() {
    browser.element('[data-settings=""]').click();
    browser.waitForExist('body *');
  });

  this.When(/^Type in "([^"]*)" and "([^"]*)"$/, function(name, description) {
    browser.refresh();
    browser.waitForExist(nameInput);
    browser.setValue(nameInput, name);
    browser.setValue(descriptionTextarea, description);
  });

  this.When(/^Click the Save changes button$/, function() {
    browser.waitForExist('[type=submit]');
    browser.click('[type=submit]');
  });

  this.When(/^Click the Close button$/, function() {
    browser.click(closeButton);
    browser.refresh();
  });

  this.Then(
    /^Should I see the updated profile "([^"]*)" and "([^"]*)"$/,
    function(profileNameExpected, profileDescriptionExpected) {
      browser.waitForExist('h3*=Judy Doe');
      let profileNameShownSelector = 'figure.pu-avatar+div h3';
      let profileNameShown = locators.getTextFromElement(
        profileNameShownSelector
      );
      // console.log(profileNameShown);
      let profileDescriptionShownSelector = 'figure.pu-avatar+div h3+p';
      let profileDescriptionShown = locators.getTextFromElement(
        profileDescriptionShownSelector
      );
      // console.log(profileDescriptionShown);
      // let profileDescriptionShown = browser.getText(profileDescriptionShownSelector);
      expect(
        profileNameExpected === profileNameShown &&
          profileDescriptionExpected === profileDescriptionShown
      ).toBe(true);
    }
  );
};

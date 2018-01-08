'use strict';

import authentication from '../helpers/authentication';
import navigator from '../helpers/navigator';
import locators from '../helpers/locators';
import cookiebar from '../helpers/cookiebar';

let messageTextarea = '[name="partup_name"]';
let sendButton = '[class=pu-button]';
let cssSelectorChatText = '.pu-chatbox .pu-highlighttext';

module.exports = function() {
  this.After(function() {
    server.execute(function() {
      ChatMessages.remove({});
    });
  });
  // this function is run before testing each scenario.
  // it makes sure that we're using a test (i.e. empty) database.
  this.Before(function(scenario) {
    // console.log(`Meteor running: ${server._original.host}:${server._original.port}`);
    // console.log(`About to test: '${scenario.getName()}'`);
  });

  // this function is run after testing each scenario
  this.After(function(scenario) {
    // TODO: clean DB, to prevent side-effects between tests
    // console.log('Test finished');
  });

  this.Given(/^The user logs in as Judy on page "([^"]*)"$/, function(
    loginUrl
  ) {
    navigator.gotoPage(loginUrl);
    authentication.loginAsJudy();
  });

  this.When(/^Navigate to Chats "([^"]*)"$/, function(chatsUrl) {
    navigator.gotoPage(chatsUrl);
    browser.element(messageTextarea).waitForExist();
  });

  this.When(/^Click 'I Understand' if cookie-bar is displayed$/, function() {
    // cookiebar.postCookie();
    cookiebar.clickCookiebarIfExists();
  });

  this.When(/^Type the message "([^"]*)"$/, function(message1) {
    browser.setValue(messageTextarea, message1);
  });

  this.When(/^Click the Send button$/, function() {
    browser.click(sendButton);
  });

  this.When(/^Then type the message "([^"]*)"$/, function(message2) {
    browser.setValue(messageTextarea, message2);
  });

  this.When(/^Click the Send button again$/, function() {
    browser.click(sendButton);
  });

  this.Then(/^Should see the messages "([^"]*)" and "([^"]*)"$/, function(
    prevMessageExpected,
    lastMessageExpected
  ) {
    browser.waitForExist(cssSelectorChatText);
    let lastMessageShown = locators.getTextFromElements(
      cssSelectorChatText,
      -1
    );
    let prevMessageShown = locators.getTextFromElements(
      cssSelectorChatText,
      -2
    );
    expect(
      prevMessageExpected === prevMessageShown &&
        lastMessageExpected === lastMessageShown
    ).toBe(true);
  });
};

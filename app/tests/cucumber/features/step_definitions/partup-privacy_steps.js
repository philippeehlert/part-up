import authentication from '../helpers/authentication';
import navigator from '../helpers/navigator';
import locators from '../helpers/locators';

module.exports = function() {
  let privateCssSelector =
    'h2 a[href="/partups/super-secret-closed-ing-partup-CJETReuE6uo2eF7eW"]';

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

  this.Given(/^The user is logged in as Admin$/, function() {
    navigator.gotoPage('login');
    authentication.logInAsAdmin();
  });

  this.Then(/^Should see part\-up title "([^"]*)"$/, function(
    aDefinedTitleInTest
  ) {
    expect(locators.getTextFromElement(privateCssSelector)).toBe(
      aDefinedTitleInTest
    );
    authentication.logout();
  });

  this.Given(/^The user is logged first time in as Judy$/, function() {
    navigator.gotoPage('login');
    authentication.loginAsJudy();
  });

  this.Then(/^Should NOT see "([^"]*)"$/, function(aDefinedTitleInTest) {
    expect(browser.isExisting(privateCssSelector)).toBeFalsy();
    authentication.logout();
  });

  this.Given(/^The user is logged in second time as Judy$/, function() {
    navigator.gotoPage('login');
    authentication.loginAsJudy();
  });

  this.When(/^The user navigates to "([^"]*)"$/, function(nonPublicPage) {
    navigator.gotoPage(nonPublicPage);
  });

  this.Then(/^Should see a non\-public warning page$/, function() {
    expect(
      browser.isExisting('.pu-errorpage.pu-errorpage-partup-closed')
    ).toBeTruthy();
    authentication.logout();
  });
};

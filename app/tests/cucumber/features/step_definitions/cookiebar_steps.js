module.exports = function() {
  this.Given(/^The cookie "([^"]*)" is not set$/, function(cookieName) {
    browser.cookie('delete', cookieName);
  });

  this.When(/^I navigate to a partup page$/, function() {
    browser.url(process.env.ROOT_URL);
  });

  this.When(/^I click on I understand button on the cookiebar$/, function() {
    browser.waitForExist('#cookie-bar');
    browser.click('#cookie-bar .cb-enable');
  });

  this.When(/^I refresh the webpage$/, function() {
    browser.refresh();
  });

  this.Then(/^I should not see a cookiebar any more$/, function() {
    browser.waitForExist('body *');
    let elem = browser.element('#cookie-bar');

    let display = elem.getCssProperty('display');

    expect(display.value).toBe('none');
  });

  this.Given(/^The cookie "([^"]*)" is already set$/, function(cookieName) {
    browser.cookie('post', { name: cookieName, value: 'enabled' });
  });

  this.When(/^I navigate to a partup page "([^"]*)"$/, function(page) {
    browser.url(process.env.ROOT_URL + page);
  });

  this.Then(/^I should not see the cookiebar$/, function() {
    browser.waitForExist('body *');
    let elem = browser.element('#cookie-bar');

    let display = elem.getCssProperty('display');

    expect(display.value).toBe('none');
  });
};

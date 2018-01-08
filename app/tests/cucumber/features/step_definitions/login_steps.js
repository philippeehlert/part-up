module.exports = function() {
  this.Given(/^I navigate to "([^"]*)"$/, function(relativePath) {
    browser.url(process.env.ROOT_URL + relativePath);
  });

  this.When(/^I enter my authentication information$/, function() {
    browser.element('[name="email"], [name="password"]').waitForExist();
    browser.setValue('[name="email"]', 'user@example.com');
    browser.setValue('[name="password"]', 'user');
    browser.click('[type=submit]');
  });

  this.Then(/^I should see my username "([^"]*)"$/, function(expectedUsername) {
    let element = browser.element('.pu-button-header-profiledropdown');
    element.waitForExist();

    expect(element.getText()).toBe(expectedUsername);
  });

  this.When(/^I enter wrong login information$/, function() {
    browser.element('[name="email"]').setValue('user@example.com');
    browser.element('[type="password"]').setValue('bad password');
    browser.element('[type=submit]').click();
  });

  this.Then(/^I should see an error$/, function() {
    let element = browser.element('.pu-state-invalid .pu-sub-error');
    element.waitForExist();
    expect(element.getText()).toBe('This password is incorrect');
  });
};

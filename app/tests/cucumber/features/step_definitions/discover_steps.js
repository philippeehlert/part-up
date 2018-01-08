module.exports = function() {
  this.Given(/^I navigate to discover$/, function() {
    browser.url(process.env.ROOT_URL + '/discover');
  });

  this.Then(/^I should see some partup tiles$/, function() {
    browser.waitForExist('.pu-partuptile');
  });

  this.When(/^I enter a discover keyword$/, function() {
    browser.waitForExist('[name="textSearch"]');
    browser.setValue('[name="textSearch"]', 'Organise');
    browser.submitForm('#discoverQueryForm');
  });

  this.When(/^I select a tribe$/, function() {
    browser.element('[data-open-networkbox]').click();
    browser.element('#networkSelector').waitForVisible();
    browser.element('[data-select-network="ibn27M3ePaXhmKzWq"]').click();
  });

  this.When(/^I select a location$/, function() {
    browser.element('[data-open-locationbox]').click();
    browser.element('#locationSelector').waitForVisible();
    browser
      .element('[data-select-suggested-location="ChIJNy3TOUNvxkcR6UqvGUz8yNY"]')
      .click();
  });

  this.Then(/^I should see filtered partups$/, function() {
    expect(browser.element('.pu-partuptile header h2 a').getText()).toBe(
      'Organise a Meteor Meetup'
    );
  });
};

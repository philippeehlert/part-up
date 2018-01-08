let cookieName = 'cb-enabled';

class CookiebarHelper {
  constructor() {}

  clickCookiebarIfExists() {
    if (browser.isVisible('#cookie-bar')) {
      console.log('    cookie-bar: click \'I understand\' button');
      browser.click('[class=cb-enable]');
    }
  }

  deleteCookie() {
    browser.cookie('delete', cookieName);
  }

  postCookie() {
    browser.cookie('post', { name: cookieName, value: 'enabled' });
    browser.refresh();
    browser.waitForExist('body *');
  }
}

export default new CookiebarHelper();

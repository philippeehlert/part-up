let baseUrl = process.env.ROOT_URL;

export default {
  gotoPage: (urlSlug) => {
    browser.url(`${baseUrl}/${urlSlug}`);
  },
  gotoHomePage: () => {
    browser.url(`${baseUrl}`);
  },
};

Template.registerHelper('partupIE9', function() {
  if (Partup.client.browser.isIE()) {
    let version = Partup.client.browser.msieversion();
    if (version && version < 10) {
      return true;
    }
  }
  return false;
});

Template.registerHelper('partupIE', function() {
  return Partup.client.browser.isIE();
});

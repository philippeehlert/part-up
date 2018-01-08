Template.app_network_chat.helpers({
  data: function() {
    let template = Template.instance();
    return {
      networkSlug: function() {
        return template.data.networkSlug;
      },
    };
  },
  appStoreLink: function() {
    return Partup.client.browser.getAppStoreLink();
  },
});

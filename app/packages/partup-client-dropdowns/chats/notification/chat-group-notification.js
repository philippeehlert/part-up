Template.ChatGroupNotification.helpers({
  chatData: function() {
    let template = Template.instance();
    let chat = template.data.chat;

    return {
      _id: chat._id,
      network: lodash.get(chat, 'static.network', {}),
      unreadCount: chat.unreadCount(),
      latestMessage: chat.latestMessage,
    };
  },
  format: function() {
    return function(content) {
      return new Partup.client.message(content)
        .sanitize()
        .parseMentions({ link: false })
        .emojify()
        .getContent();
    };
  },
  getImage: function(imageObj) {
    return Partup.helpers.url.getImageUrl(imageObj, '80x80');
  },
});

Template.ChatGroupNotification.events({
  'click [href]': function(event) {
    Partup.client.browser.onMobileOs(function() {
      if (!Partup.client.isMobile.isTablet()) {
        event.preventDefault();
        let appStoreLink = Partup.client.browser.getAppStoreLink();
        window.open(appStoreLink, '_blank');
      }
    });
  },
  'click [data-notification]': function(event, template) {
    let notificationId = $(event.currentTarget).data('notification');
    template.data.onClick();
  },
});

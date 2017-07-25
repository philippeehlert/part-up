Template.ChatOneOnOneNotification.helpers({
    chatData: function() {
        var template = Template.instance();
        var chat = template.data.chat;

        return {
            _id: chat._id,
            chatter: lodash.get(chat, 'static.chatter', {}),
            unreadCount: chat.unreadCount(),
            latestMessage: chat.latestMessage,
        };
    },
    formatted: function(content) {
        return new Partup.client.message(content)
            .sanitize()
            .parseMentions({link: false})
            .emojify()
            .getContent();
    },
    getImage: function(imageObj) {
        return Partup.helpers.url.getImageUrl(imageObj, '80x80');
    }
});

Template.ChatOneOnOneNotification.events({
    'click [href]': function(event) {
        Partup.client.browser.onMobileOs(function() {
            if (!Partup.client.isMobile.isTablet()) {
                event.preventDefault();
                var appStoreLink = Partup.client.browser.getAppStoreLink();
                window.open(appStoreLink, '_blank');
            }
        });
    },
    'click [data-notification]': function(event, template) {
        var notificationId = $(event.currentTarget).data('notification');
        template.data.onClick();
    }
});

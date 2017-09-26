Template.ChatMessage.onRendered(function() {
    var template = this;
});

Template.ChatMessage.helpers({
    data: function() {
        var template = Template.instance();
        var data = template.data.data;
        var user = Meteor.users.findOne({ _id: data.creator_id });
        return {
            messageCreator: function() {
                return user;
            },
            deactivated: function() {
                return !user;
            },
            messages: function() {
                data.messages[0].creator = user;
                return data.messages;
            },
            highlight: function() {
                return template.data.highlight.get() || '';
            }
        };
    },
    chatMessage: function(content, highlightText) {
        var message = new Partup.client.message(content)
        .sanitize()
        .autoLink()
        .lineBreakToBr()
        .parseMentions({link: true})
        .emojify();

        if (highlightText) message.highlight(highlightText);
        return message.getContent();
    },
    handlers: function() {
        var template = Template.instance();
        return {
            onNewMessageRender: function() {
                return template.data.onNewMessageRender;
            }
        };
    }
});

Template.ChatMessage.events({
    'click [data-chat-message-id]': function(event, template) {
        var messageId = $(event.currentTarget).data('chat-message-id');
        if (template.data.onMessageClick) template.data.onMessageClick(event, this);
    },
    'click [data-chat-message-id] a': function(event, template) {
        if (!template.data.onMessageClick) return;
        var destination = $(event.currentTarget).attr('href');
        var location = window.location;
        if (destination.indexOf(location.pathname) > -1 && destination.indexOf(location.host) > -1) {
            event.preventDefault();
            event.stopPropagation();
            var hash = destination.substring(destination.indexOf('#'));
            template.data.onMessageClick(event, {hash: hash.split('#').join('')});
        }
    }
});

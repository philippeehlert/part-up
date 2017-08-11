Template.OneOnOneChatSidebar.onCreated(function() {
    var template = this;
    template.searchValue = new ReactiveVar(undefined);
    template.searchResults = new ReactiveVar(undefined);
    template.selectedIndex = new ReactiveVar(0);
    template.privateLimit = new ReactiveVar(10);
    template.chats = new ReactiveVar([]);

    var searchUser = function(query) {
        template.searchValue.set(query);
        if (!query.length) return template.searchResults.set(undefined);
        var currentQuery = query;
        Meteor.call('users.autocomplete', query, undefined, undefined, {chatSearch: true}, function(err, users) {
            if (err) return Partup.client.notify.error('something went wrong');

            if (query === currentQuery) {
                template.searchResults.set(users);
                template.selectedIndex.set(0);
            }
        });
    };
    template.throttledSearchUser = _.throttle(searchUser, 500, {trailing: true});

    template.autorun(function() {
        var ready = Partup.client.chatData.unreadSubscriptionReady.get();
        if (!ready) return;
        var privateLimit = template.privateLimit.get();
        var chats = Chats
            .find({_id: { $nin: Partup.client.chatData.networkChatIds }}, {
                sort: { updated_at: -1 },
                limit: privateLimit,
            })
            .map(Partup.client.chatData.populateChatData);
        template.chats.set(chats);
    });
});

Template.OneOnOneChatSidebar.helpers({
    data: function() {
        var template = Template.instance();
        var user = Meteor.user() || {};
        var privateLimit = template.privateLimit.get();
        var chats = template.chats.get();
        const activeChatId = template.data.config.reactiveActiveChat.get();

        return {
            chats: function() {
                return chats;
            },
            activeChat: function() {
                const chat = Chats.findOne({_id: activeChatId});
                return chat ? Partup.client.chatData.populateChatData(chat) : false;
            },
            searchValue: function() {
                return template.searchValue.get();
            },
            searchResults: function() {
                return template.searchResults.get();
            },
            canLoadMore: function() {
                var totalPrivate = chats.length;
                return privateLimit <= totalPrivate;
            },
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            activeChat: function() {
                return template.data.config.reactiveActiveChat.get();
            },
            selectedIndex: function() {
                return template.selectedIndex.get();
            },
            started_typing: function(user_id, chat_id) {
                var chat = Chats.findOne(chat_id);
                if (!chat) return false;
                if (!chat.started_typing) return false;
                var typing_user = lodash.find(chat.started_typing, {upper_id: user_id});
                if (!typing_user) return false;
                var started_typing_date = new Date(typing_user.date).getTime();
                var now = new Date().getTime();
                return now - started_typing_date < Partup.client.chat.MAX_TYPING_PAUSE;
            },
            loading: function() {
                return !Partup.client.chatData.unreadSubscriptionReady.get();
            }
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
    },
    isOnline: function(_id) {
        var user = Meteor.users.findOne({_id: _id});
        return lodash.get(user, 'status.online', false);
    }
});

Template.OneOnOneChatSidebar.events({
    // 'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]': Partup.client.scroll.preventScrollPropagation,
    // 'scroll [data-preventscroll]': function(event, template) {
    //     console.log(event);
    // },
    'input [data-search]': function(event, template) {
        template.throttledSearchUser(event.currentTarget.value);
    },
    'keyup [data-search]': function(event, template) {
        var pressedKey = event.which ? event.which : event.keyCode;
        if (pressedKey === 40) {
            // down
            var results = template.searchResults.get();
            var max = results ? results.length - 1 : 0;
            template.selectedIndex.set(template.selectedIndex.curValue < max ? template.selectedIndex.curValue + 1 : max);
        } else if (pressedKey === 38) {
            // up
            template.selectedIndex.set(template.selectedIndex.curValue > 0 ? template.selectedIndex.curValue - 1 : 0);
        } else if (pressedKey === 13) {
            // return
            $('[data-index=' + template.selectedIndex.curValue + ']').trigger('click');
            $('[data-search]').val('');
        }
    },
    'click [data-clear]': function(event, template) {
        event.preventDefault();
        event.stopPropagation();
        $('[data-search]').val('');
        _.defer(function() {
            template.throttledSearchUser('');
            $('[data-search]').blur();
        });
    },
    'click [data-start]': function(event, template) {
        event.preventDefault();
        $('[data-search]').val('');
        $('[data-search]').blur();
        var userId = $(event.currentTarget).data('start');
        template.data.config.onStartChat(userId);
        template.throttledSearchUser('');
        template.selectedIndex.set(0);
        lodash.defer(() => {
            $('[data-list-scroller]').scrollTop(0);
        });
    },
    'click [data-initialize]': function(event, template) {
        lodash.defer(() => {
            $('[data-list-scroller]').scrollTop(0);
        });
    },
    'click [data-loadmore]': function(event, template) {
        event.preventDefault();
        template.privateLimit.set(template.privateLimit.get() + 5);
    },
});

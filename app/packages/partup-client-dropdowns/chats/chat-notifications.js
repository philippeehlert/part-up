Template.DropdownChatNotifications.onCreated(function () {
    var template = this;
    template.newMessage = new ReactiveVar(undefined);
    template.latestMessage = new ReactiveVar(0);
    template.networkLimit = new ReactiveVar(10);
    template.privateLimit = new ReactiveVar(10);

    // little subscription to keep the chats up to date
    template.subscribe('chats.one_on_one', function() {
        debouncedFetch();
        var keepCount = Chats.find().count();
        template.autorun(function() {
            var currentCount = Chats.find().count();
            if (keepCount !== currentCount) {
                debouncedFetch();
                keepCount = currentCount;
            }
        })
    });

    /** variable name gets used by the ClientDropdowns event handler. */
    template.dropdownOpen = new ReactiveVar(false);

    template.privateActive = new ReactiveVar(true, function(a, privateActive) {
        if (privateActive) {
            template.privateLimit.set(10);
        } else {
            template.networkLimit.set(10);
        }
    });
    template.networkChatIds = new ReactiveVar([]);
    var userId = Meteor.userId();
    template.networkChatCollection = new ReactiveVar([]);
    template.privateChatCollection = new ReactiveVar([]);

    // fetch chat data
    template.fetch = function() {
        if (template.view.isDestroyed) return; // do nothing if view is destroyed

        Partup.client.chatData.initialize(function(chatIds) {
            if (template.view.isDestroyed) return; // do nothing if view is destroyed

            // autorunner that populates unread-messages counter
            // subscription with static chat metadata
            var chatIds = chatIds || [];
            template.subscribe('chats.for_loggedin_user.unread_count', chatIds, function() {
                Partup.client.chatData.unreadSubscriptionReady.set(true);
                template.autorun(function() {
                    var networkLimit = template.networkLimit.get();
                    var privateLimit = template.privateLimit.get();
                    var networkChats = Chats
                        .find({_id: {$in: Partup.client.chatData.networkChatIds}}, {sort: {updated_at: -1}, limit: networkLimit})
                        .map(Partup.client.chatData.populateChatData);
                    var privateChats = Chats
                        .find({_id: {$nin: Partup.client.chatData.networkChatIds}}, {sort: {updated_at: -1}, limit: privateLimit})
                        .map(Partup.client.chatData.populateChatData);
                    template.networkChatCollection.set(networkChats);
                    template.privateChatCollection.set(privateChats);
                });
            });
        });
    }
    var debouncedFetch = lodash.throttle(template.fetch, 10000, {trailing: false, leading: true});
});
Template.DropdownChatNotifications.onRendered(function () {
    var template = this;
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu=chat-notifications]', function () { ClientDropdowns.partupNavigationSubmenuActive.set(false); });
    Router.onBeforeAction(function (req, res, next) {
        template.dropdownOpen.set(false);
        next();
    });
});

Template.DropdownChatNotifications.onDestroyed(function () {
    var template = this;
    ClientDropdowns.removeOutsideDropdownClickHandler(template);
});

Template.DropdownChatNotifications.events({
    'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]': Partup.client.scroll.preventScrollPropagation,
    'click [data-toggle-menu]': function (event, template) {
        template.newMessage.set(false);
        ClientDropdowns.dropdownClickHandler(event, template);
    },
    'click [data-loadmore]': function (event, template) {
        event.preventDefault();
        if (template.privateActive.get()) {
            template.privateLimit.set(template.privateLimit.get() + 5);
        } else {
            template.networkLimit.set(template.networkLimit.get() + 5);
        }
    },
    'click [data-private]': function (event, template) {
        event.preventDefault();
        template.privateActive.set(true);
        const list = template.find('ul[data-preventscroll]');
        list.scrollTop = 0;
    },
    'click [data-network]': function (event, template) {
        event.preventDefault();
        template.privateActive.set(false);
        const list = template.find('ul[data-preventscroll]');
        list.scrollTop = 0;
    }
});

Template.DropdownChatNotifications.helpers({
    dropdownOpen: function () {
        return Template.instance().dropdownOpen.get();
    },
    privateActive: function () {
        return Template.instance().privateActive.get();
    },
    chatData: function () {
        var template = Template.instance();
        var userId = Meteor.userId();
        var privateLimit = template.privateLimit.get();
        var networkLimit = template.networkLimit.get();
        var privateActive = template.privateActive.get();
        // var networkChatIds = template.networkChatIds.get();

        if (!userId) return;
        var currentActiveChatId = Session.get('partup-current-active-chat');
        var privateChats = template.privateChatCollection.get();
        var networkChats = template.networkChatCollection.get();

        return {
            private: privateChats,
            network: networkChats,
            showPrivate: template.privateActive.get(),
            totalMessages: function (chatCollection) {
                return chatCollection
                    .map(function (chat) {
                        return chat._id === currentActiveChatId ? 0 : chat.unreadCount();
                    }).reduce(function (prev, curr) {
                        return prev + curr;
                    }, 0);
            },
            canLoadMore: function() {
                var totalPrivate = privateChats.length;
                var totalNetwork = networkChats.length;
                if (privateActive) return privateLimit <= totalPrivate
                return networkLimit <= totalNetwork;
            },
            newMessages: function() {
                return Chats.findOne({ counter: { $elemMatch: { unread_count: { $gt: 0 }, user_id: userId }}});
            }
        }
    },
    notificationClickHandler: function () {
        var template = Template.instance();
        return function () {
            template.dropdownOpen.set(false);
        };
    },
    appStoreLink: function () {
        return Partup.client.browser.getAppStoreLink();
    },
    loading: function() {
        return !Partup.client.chatData.unreadSubscriptionReady.get();
    }
});

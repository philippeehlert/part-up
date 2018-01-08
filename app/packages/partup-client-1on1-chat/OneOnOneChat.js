Template.OneOnOneChat.onCreated(function() {
  let template = this;
  let chatId = template.data.chatId || undefined;
  let startChatUserId = template.data.startChatUserId || undefined;
  template.activeChat = new ReactiveVar(undefined);
  template.chatPerson = new ReactiveVar(undefined);
  template.bottomBarHeight = new ReactiveVar(68);
  template.loadingOlderMessages = false;
  template.LIMIT = 20;
  // this subscription is redundant because the chat-dropdown is already subscribed to the same publication
  // template.subscribe('private_chats.for_loggedin_user', { limit: 10 });
  template.onUserData = function(users) {
    let userIds = users.map(function(user) {
      return user._id;
    });
    template.subscribe('users.by_ids.for_online_status', userIds);
  };
  Partup.client.chatData.onUsersData(template.onUserData);
  template.startNewChat = function(userId) {
    Meteor.call('chats.start_with_users', [userId], function(err, chat_id) {
      if (err) return Partup.client.notify.error('nope');
      if (template.view.isDestroyed) return;
      let chat = Chats.findOne({ _id: chat_id });
      Router.go(window.location.pathname + '#' + chat_id);

      // only refetch if it's a new chat
      if (!chat) Partup.client.chatData.refetch(function() {});
    });
  };

  let currentChatId = undefined;
  template.activeChatSubscription = undefined;
  template.activeChatSubscriptionReady = new ReactiveVar(false);
  let chatMessageOptions = {
    limit: template.LIMIT,
  };
  template.initializeChat = function(chatId, person) {
    template.activeChat.set(chatId);
    template.activeChatSubscriptionReady.set(false);
    template.activeChatSubscription = template.subscribe(
      'chats.by_id.for_web',
      chatId,
      chatMessageOptions,
      {
        onReady: function() {
          if (person) {
            template.chatPerson.set(person);
          } else {
            template.chatPerson.set(
              Meteor.users.findOne({
                _id: { $nin: [Meteor.userId()] },
                chats: { $in: [chatId] },
              })
            );
          }
          startMessageCollector(chatId);
          template.activeChatSubscriptionReady.set(true);
        },
      }
    );
  };

  template.limitReached = new ReactiveVar(false);
  template.messageLimit = new ReactiveVar(template.LIMIT, function(
    oldLimit,
    newLimit
  ) {
    if (oldLimit === newLimit) return;
    chatMessageOptions.limit = newLimit;
    chatSubscription = template.subscribe(
      'chats.by_id.for_web',
      chatId,
      chatMessageOptions,
      {
        onReady: function() {
          let messagesCount = ChatMessages.find(
            { chat_id: chatId },
            { limit: newLimit }
          ).count();
          let totalNewMessages = messagesCount - oldLimit;
          if (totalNewMessages < 1) {
            template.limitReached.set(true);
          } else {
            template.loadingOlderMessages = false;
          }
        },
      }
    );
  });

  template.autorun(function() {
    let cid = template.activeChat.get() || chatId;
    let chat = Chats.findOne({ _id: cid });
    if (cid) {
      Meteor.call('chats.reset_counter', cid);
    }
  });

  template.loadOlderMessages = function() {
    if (template.loadingOlderMessages) return;
    template.loadingOlderMessages = true;
    if (template.limitReached.get()) return;
    template.messageLimit.set(template.messageLimit.get() + template.LIMIT);
  };

  let localChatMessagesCollection = [];
  template.reactiveMessages = new ReactiveVar([]);
  var startMessageCollector = function(chat_id) {
    // reset
    currentChatId = chat_id;
    localChatMessagesCollection = [];

    // gets chatmessages and stores them in localChatMessagesCollection
    template.autorun(function(computation) {
      if (chat_id !== currentChatId) return computation.stop();

      let limit = template.messageLimit.get();
      let messages = ChatMessages.find(
        { chat_id: chat_id },
        { sort: { created_at: 1 } }
      ).fetch();

      // wrapped in nonreactive to prevent unnecessary autorun
      Tracker.nonreactive(function() {
        template.reactiveMessages.set(messages);
      });
    });
  };

  if (chatId) {
    template.initializeChat(chatId);
  } else if (startChatUserId) {
    template.startNewChat(startChatUserId);
  }
  template.autorun(function() {
    let controller = Iron.controller();
    let hash = controller.getParams().hash;
    if (chatId !== hash) {
      template.initializeChat(hash);
      chatId = hash;
    }
  });

  // quick switcher
  template.quickSwitcher = function(event) {
    let pressedKey = event.which ? event.which : event.keyCode;

    // mac CMD + K
    if (event.metaKey && pressedKey === 75) $('[data-search]').focus();

    // mac + windows CTRL + K
    if (event.ctrlKey && pressedKey === 75) {
      event.preventDefault();
      $('[data-search]').focus();
    }
    // CMD + T won't work or be acceptable since it opens a new browser tab
  };
  $(window).on('keydown', template.quickSwitcher);
});

Template.OneOnOneChat.onDestroyed(function() {
  let template = this;
  $(window).off('keydown', template.quickSwitcher);
  Partup.client.chatData.offUsersData(template.onUserData);
});

Template.OneOnOneChat.helpers({
  data: function() {
    let template = Template.instance();
    return {
      activeChat: function() {
        return template.activeChatSubscriptionReady.get();
      },
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      selectedChat: function() {
        return template.activeChat.get();
      },
    };
  },
  config: function() {
    let template = Template.instance();
    let chatId = template.activeChat.get();
    let chatPerson = template.chatPerson.get();
    return {
      sideBar: function() {
        return {
          onStartChat: template.startNewChat,
          onInitializeChat: template.initializeChat,
          reactiveActiveChat: template.activeChat,
        };
      },
      bottomBar: function() {
        return {
          reactiveChatId: template.activeChat,
          reactiveBottomBarHeight: template.bottomBarHeight,
          messageInputSelector: '[data-messageinput]',
        };
      },
      messageView: function() {
        return {
          chatId: chatId,
          onScrollTop: {
            handler: template.loadOlderMessages,
            offset: 400,
          },
          onNewMessagesViewed: lodash.noop,
          reactiveMessages: template.reactiveMessages,
          reactiveHighlight: new ReactiveVar(''),
          reactiveBottomBarHeight: template.bottomBarHeight,
          placeholderText: TAPi18n.__(
            'pages-one-on-one-chat-empty-placeholder',
            {
              person: chatPerson.profile.name,
            }
          ),
          messageInputSelector: '[data-messageinput]',
        };
      },
    };
  },
});

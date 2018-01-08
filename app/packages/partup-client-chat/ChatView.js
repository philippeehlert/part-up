Template.ChatView.onCreated(function() {
  let template = this;
  let chatId = template.data.config.chatId;
  if (!chatId) throw 'No chatId was provided';

  Session.set('partup-current-active-chat', chatId);

  template.overscroll = new ReactiveVar(false);
  template.underscroll = new ReactiveVar(false);
  template.chatEmpty = new ReactiveVar(false);
  template.oldestUnreadMessage = new ReactiveVar(undefined);
  template.activeContext = new ReactiveVar(false);

  template.initialized = false;

  if (template.data.config.reactiveBottomBarHeight) {
    template.data.config.reactiveBottomBarHeight.equalsFunc = function(a, b) {
      // when the chatbar height changes (due to typing), the view should scroll to bottom
      template.instantlyScrollToBottom();
    };
  }

  let handleNewMessagesViewedIfMessageDividerIsOnScreen = function() {
    Meteor.setTimeout(function() {
      if (!template.dividerLineIsVisible()) return;
      template.hideNewMessagesDivider();
    }, 4000);
  };

  template.instantlyScrollToBottom = function() {
    template.scrollContainer[0].scrollTop = 0;
  };

  template.dividerLineIsVisible = function() {
    let dividerElement = $('[data-new-messages-divider]');
    if (!dividerElement[0]) return false; // maybe it's already hidden, I dunno

    let scrollElement = template.scrollContainer;
    let scrollDest =
      dividerElement[0].offsetTop -
      (scrollElement[0].clientHeight - dividerElement[0].clientHeight * 1.5);
    return scrollElement.scrollTop() >= scrollDest;
  };

  template.hideTimeout;
  template.hideNewMessagesDivider = function() {
    if (template.hideTimeout) clearTimeout(template.hideTimeout);
    template.data.config.onNewMessagesViewed();

    let overscroll = template.overscroll.get();
    let underscroll = template.underscroll.get();
    if (overscroll || underscroll) return;

    // check if the divider line is visible for the user, then hide it
    if (!template.dividerLineIsVisible()) return;

    let dividerElement = $('[data-new-messages-divider]');
    dividerElement.addClass('hide');

    // remove the oldestUnreadMessage when the divider has faded out
    Meteor.setTimeout(function() {
      template.oldestUnreadMessage.set(undefined);
    }, 250);
  };
  template.delayedHideNewMessagesDivider = function(delay) {
    if (template.hideTimeout) clearTimeout(template.hideTimeout);
    template.hideTimeout = setTimeout(template.hideNewMessagesDivider, delay);
    template.data.config.onNewMessagesViewed();
  };

  template.rememberOldestUnreadMessage = function(oldestUnreadMessage) {
    if (!template.oldestUnreadMessage.get()) {
      template.oldestUnreadMessage.set(oldestUnreadMessage);
    }
  };

  template.newMessagesDividerHandler = function(messages) {
    let chat = Chats.findOne(chatId);
    if (!chat) return;

    let userId = Meteor.userId();
    let counter = lodash.find(chat.counter || [], { user_id: userId });

    // get the unread messages count
    let unreadMessagesCount = counter ? counter.unread_count : 0;

    // if there are no unread messages
    if (unreadMessagesCount <= 0) return;

    // if user is focussed stop here
    if (template.initialized) return;

    // returns the oldest unread message with n offset
    // offset = 0 is oldest, offset = 1 is second oldest
    let returnOldestUnreadMessageWithOffset = function(n) {
      return messages[messages.length - (unreadMessagesCount + 1 - n)];
    };

    let offset = 0;
    let oldestUnreadMessage = returnOldestUnreadMessageWithOffset(offset);

    // stop if there is no oldest unread message
    if (!oldestUnreadMessage) return;

    // make sure the oldest unread message is not the current user's message
    while (oldestUnreadMessage.creator_id === userId) {
      offset++;
      let newOldestMessage = returnOldestUnreadMessageWithOffset(offset);
      if (!newOldestMessage) {
        oldestUnreadMessage = undefined;
        break;
      }
      oldestUnreadMessage = newOldestMessage;
      if (offset == unreadMessagesCount) break;
    }

    // again, stop if there is no oldest unread message
    if (!oldestUnreadMessage) return;

    template.rememberOldestUnreadMessage(oldestUnreadMessage);
  };

  template.stickyNewMessagesDividerHandler = function(options) {
    if ($('[data-new-messages-divider]')[0]) {
      let overscroll = $('[data-new-messages-divider]').position().top < 0;
      let underscroll =
        $('[data-new-messages-divider]').position().top >
        template.scrollContainer[0].clientHeight -
          $('[data-new-messages-divider]').outerHeight(true);
      template.overscroll.set(overscroll);
      template.underscroll.set(underscroll);
      if (!overscroll && (options && options.hideLine)) {
        template.delayedHideNewMessagesDivider(1000);
      }
    }
  };

  template.scrollToNewMessages = function() {
    template.overscroll.set(false);
    template.underscroll.set(false);

    let dividerElement = $('[data-new-messages-divider]');
    let scrollElement = template.scrollContainer;
    let scrollDest = dividerElement[0].offsetTop - scrollElement.height();

    scrollElement.animate(
      {
        scrollTop: scrollDest,
      },
      300,
      function() {
        template.delayedHideNewMessagesDivider(1000);
      }
    );
  };

  template.onMessageClick = function(event, message) {
    if (!template.data.config.onMessageClick) return;
    let searching = false;
    if (template.data.config.reactiveHighlight) {
      searching = !!template.data.config.reactiveHighlight.curValue;
    }
    template.data.config.onMessageClick({
      message: message,
      searching: searching,
      target: $('[data-chat-message-id=' + message._id + ']'),
    });
  };

  let newMessageListeneners = [];
  template.onNewMessageRender = function(callback) {
    newMessageListeneners.push(callback);
  };
  template.newMessagesDidRender = function() {
    newMessageListeneners.forEach(function() {
      newMessageListeneners.pop().call();
    });
  };

  template.scrollHandler = function(customScrollEvent) {
    template.stickyNewMessagesDividerHandler({ hideLine: true });
    if (template.data.config.onScrollTop) {
      let offset = template.data.config.onScrollTop.offset || 0;
      if (customScrollEvent.top.offset <= offset) {
        template.data.config.onScrollTop.handler();
      }
    }
  };

  let initialize = function() {
    template.autorun(function() {
      let messages = template.data.config.reactiveMessages.get();
      Tracker.nonreactive(function() {
        template.newMessagesDividerHandler(messages);
        template.chatEmpty.set(!messages.length);
      });
    });

    template.data.config.onNewMessagesViewed();
    handleNewMessagesViewedIfMessageDividerIsOnScreen();
  };

  template.initialize = function() {
    Partup.client.chat.initialize(template);
    initialize();
    template.initialized = true;
  };
});

Template.ChatView.onRendered(function() {
  let template = this;
  template.scrollContainer = $('[data-pu-reversed-scroller]');
  template.initialize();
});

Template.ChatView.onDestroyed(function() {
  let template = this;
  Partup.client.chat.destroy();
  Session.set('partup-current-active-chat', undefined);
});

Template.ChatView.helpers({
  messagesData: function() {
    let template = Template.instance();
    let messages = template.data.config.reactiveMessages.get();
    let oldestUnreadMessage = template.oldestUnreadMessage.get();
    let dateBorder = oldestUnreadMessage
      ? oldestUnreadMessage.created_at
      : new Date();
    return {
      old: function() {
        return _.filter(messages, function(message) {
          return message.created_at < dateBorder;
        });
      },
      new: function() {
        return _.filter(messages, function(message) {
          return message.created_at >= dateBorder;
        });
      },
    };
  },
  groupByDelay: function(messages) {
    return Partup.client.chatmessages.groupByDelay(messages || [], {
      seconds: 180,
    });
  },
  groupByDay: function(messages) {
    return Partup.client.chatmessages.groupByCreationDay(messages || []);
  },
  groupByUser: function(messages) {
    return Partup.client.chatmessages.groupByCreatorId(messages || []);
  },
  state: function() {
    let template = Template.instance();
    return {
      reactiveHighlight: function() {
        return template.data.config.reactiveHighlight;
      },
      limitReached: function() {
        return template.data.config.messageLimitReached;
      },
      overscroll: function() {
        return template.overscroll.get();
      },
      underscroll: function() {
        return template.underscroll.get();
      },
      chatEmpty: function() {
        return template.chatEmpty.get();
      },
      placeholderText: function() {
        return template.data.config.placeholderText;
      },
      bottomOffset: function() {
        return template.data.config.reactiveBottomBarHeight.get();
      },
      activeContext: function() {
        let message = template.activeContext.get();
        if (!message) return false;
        if (message.created_at) return message;
        return {
          _id: message._id,
          no_date: TAPi18n.__(
            'pages-app-network-chat-highlight-context-no-date'
          ),
        };
      },
    };
  },
  handlers: function() {
    let template = Template.instance();
    return {
      onMessageRender: function() {
        return template.newMessagesDidRender;
      },
      onMessageClick: function() {
        return template.onMessageClick;
      },
      onScroll: function() {
        return template.scrollHandler;
      },
    };
  },
  translations: function() {
    let template = Template.instance();
    return {
      noresultsResults: function() {
        return TAPi18n.__('pages-app-chat-label-noresults', {
          searchquery: template.data.config.reactiveHighlight.get(),
        });
      },
      showingResults: function() {
        return TAPi18n.__('pages-app-chat-label-showingresults', {
          searchquery: template.data.config.reactiveHighlight.get(),
        });
      },
    };
  },
});

Template.ChatView.events({
  'click [data-new-messages-divider]': function(event, template) {
    template.hideNewMessagesDivider();
  },
  'click [data-scrollto]': function(event, template) {
    event.preventDefault();
    template.scrollToNewMessages();
  },
  'click [data-clear-context]': function(event, template) {
    Partup.client.chat.clearMessageContext();
  },
});

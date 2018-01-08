Meteor.methods({
  /**
   * Insert a chat message in the chat
   *
   * @param {mixed[]} fields
   */
  'chatmessages.insert': function(fields) {
    check(fields, Partup.schemas.forms.chatMessage);

    this.unblock();

    // Check if user is logged in
    let user = Meteor.user();
    if (!user) throw new Meteor.Error(401, 'unauthorized');

    // Check if message is for a network, and if the user is member of the network
    let network = Networks.findOne({ chat_id: fields.chat_id });
    if (network) {
      if (!network.hasMember(user._id)) {
        throw new Meteor.Error(401, 'unauthorized, not a member of network');
      }
    } else {
      // Check if user is actually part of this chat
      if (!user.chats || user.chats.indexOf(fields.chat_id) < 0) {
        throw new Meteor.Error(401, 'unauthorized, not part of chat');
      }
    }

    try {
      let chat = Chats.findOneOrFail(fields.chat_id);
      let chatMessage = {
        _id: Random.id(),
        chat_id: chat._id,
        content: fields.content,
        created_at: new Date(),
        creator_id: user._id,
        read_by: [],
        seen_by: [],
        updated_at: new Date(),
      };

      // Insert message
      ChatMessages.insert(chatMessage);
      Event.emit('chats.messages.inserted', user, chatMessage, network);

      // Increase counters
      chat.incrementCounter(user._id);

      // Update the chat
      Chats.update(chat._id, { $set: { updated_at: new Date() } });

      let receiverIds = [],
        message,
        payload = {},
        filterDevices = function() {
          return true;
        }; // all devices by default

      // Send push notifications to devices
      if (network) {
        // Network chat
        receiverIds = Meteor.users
          .find({ _id: { $in: network.uppers } })
          .fetch()
          .map(function(user) {
            return user._id;
          })
          .filter(function(id) {
            return id !== user._id; // filter current user
          });
        message =
          user.profile.name + ' in ' + network.name + ': ' + fields.content; // todo TAPi18n.__('', {sender: user.profile.name, network: network.name, message: fields.content});
        payload = {
          chat: {
            _id: chat._id,
            name: network.name,
            type: 'networks',
            networkSlug: network.slug,
          },
        };
        filterDevices = function(device) {
          // Filter devices with app releases before 1.4.0
          // Since they don't have the network chat feature
          return device.appVersion && device.appVersion !== 'unknown';
        };
      } else {
        // Private chat
        receiverIds = Meteor.users
          .find({ chats: { $in: [chat._id] } })
          .fetch()
          .map(function(user) {
            return user._id;
          })
          .filter(function(id) {
            return id !== user._id; // filter current user
          });
        message = user.profile.name + ': ' + fields.content; // todo TAPi18n.__('', {sender: user.profile.name, message: fields.content});
        payload = {
          chat: {
            _id: chat._id,
            username: user.profile.name, // To support apps before 1.4.0
            name: user.profile.name,
            type: 'private',
            networkSlug: undefined,
          },
        };
      }

      Partup.server.services.pushnotifications.send(
        receiverIds,
        filterDevices,
        message,
        payload
      );

      return chatMessage._id;
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'chatmessage_could_not_be_inserted');
    }
  },

  /**
   * Remove a chat message from the chat
   *
   * @param {String} chatMessageId
   */
  'chatmessages.remove': function(chatMessageId) {
    check(chatMessageId, String);

    let user = Meteor.user();
    let chatMessage = ChatMessages.findOne(chatMessageId);
    if (!user || !chatMessage || chatMessage.creator_id !== user._id) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      ChatMessages.remove(chatMessage._id);
    } catch (error) {
      throw new Meteor.Error(400, 'chatmessage_could_not_be_deleted');
    }
  },

  /**
   * Add upper to seen list
   *
   * @param {String} chatMessageId
   */
  'chatmessages.seen': function(chatMessageId) {
    check(chatMessageId, String);

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(401, 'unauthorized');

    try {
      let chatMessage = ChatMessages.findOne(chatMessageId);
      chatMessage.addToSeen(user._id);
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'chatmessage_could_not_be_inserted');
    }
  },

  /**
   * Add upper to read list (and automatically to seen)
   *
   * @param {String} chatMessageId
   */
  'chatmessages.read': function(chatMessageId) {
    check(chatMessageId, String);

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(401, 'unauthorized');

    try {
      let chatMessage = ChatMessages.findOne(chatMessageId);
      chatMessage.addToSeen(user._id);
      chatMessage.addToRead(user._id);
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'chatmessage_could_not_be_inserted');
    }
  },

  /**
   * Search chatmessages in a network
   *
   * @param {String} networkSlug
   * @param {String} query
   * @param {Object} options
   */
  'chatmessages.search_in_network': function(networkSlug, query, options) {
    check(networkSlug, String);
    check(query, String);
    check(options, {
      limit: Match.Optional(Number),
      skip: Match.Optional(Number),
    });

    let user = Meteor.user();
    let network = Networks.findOneOrFail({ slug: networkSlug });
    if (!user || !network.hasMember(user._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      // Set the search criteria
      let searchCriteria = [
        { content: new RegExp('.*' + query + '.*', 'i') },
        { 'preview_data.title': new RegExp('.*' + query + '.*', 'i') },
        {
          'preview_data.description': new RegExp('.*' + query + '.*', 'i'),
        },
      ];
      return ChatMessages.find(
        {
          $and: [{ chat_id: network.chat_id }, { $or: searchCriteria }],
        },
        options
      ).fetch();
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'chatmessages_could_not_be_searched');
    }
  },

  /**
   * Search chatmessages in a network
   *
   * @param {String} networkSlug
   * @param {String} messageId
   * @param {Object} options
   */
  'chatmessages.get_context': function(networkSlug, messageId, options) {
    check(networkSlug, String);
    check(messageId, String);
    check(options, {
      limit: Match.Optional(Number),
      skip: Match.Optional(Number),
    });

    let user = Meteor.user();
    let network = Networks.findOneOrFail({ slug: networkSlug });
    if (!user || !network.hasMember(user._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      let limit = options.limit ? Math.round(options.limit / 2) : 10;
      let chatId = network.chat_id;
      let contextMessage = ChatMessages.findOne(messageId);

      let olderMessages = ChatMessages.find(
        {
          chat_id: chatId,
          created_at: { $lt: contextMessage.created_at },
        },
        {
          limit: limit,
          sort: { created_at: -1 },
        }
      )
        .fetch()
        .sort(function(a, b) {
          let dateA = a.created_at;
          let dateB = b.created_at;

          // Make sure undefined dates are not interpreted as date
          if (!dateA && !dateB) return 0;
          if (dateA && !dateB) return -1;
          if (!dateA && dateB) return 1;

          return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
        });

      let newerMessages = ChatMessages.find(
        {
          chat_id: chatId,
          created_at: { $gt: contextMessage.created_at },
        },
        {
          limit: limit,
          sort: { created_at: 1 },
        }
      ).fetch();

      return [].concat(olderMessages, [contextMessage], newerMessages);
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'chatmessage_context_could_not_be_found');
    }
  },
});

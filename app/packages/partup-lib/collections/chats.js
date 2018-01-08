/**
 * Chat model
 *
 * @memberOf Chats
 */
let Chat = function(document) {
  _.extend(this, document);
};

Chat.prototype.unreadCount = function() {
  let countObject =
    _.find(this.counter || [], { user_id: Meteor.userId() }) || {};
  return countObject.unread_count || 0;
};

Chat.prototype.hasUnreadMessages = function() {
  let countObject =
    _.find(this.counter || [], { user_id: Meteor.userId() }) || {};
  return !!countObject.unread_count;
};

Chat.prototype.removeFull = function() {
  Meteor.users.update(
    {
      chats: {
        $in: [this._id],
      },
    },
    {
      $pull: {
        chats: this._id,
      },
    },
    {
      multi: true,
    }
  );

  Networks.update(
    {
      chat_id: this._id,
    },
    {
      $unset: {
        chat_id: null,
      },
    }
  );

  ChatMessages.remove({ chat_id: this._id });
  Chats.remove({ _id: this._id });
};

/**
 * Set a user as typing
 *
 * @memberOf Chats
 * @param {String} userId the id of the user that started typing
 * @param {Date} typingDate the front-end date of when the user started typing
 */
Chat.prototype.startedTyping = function(userId, typingDate) {
  let typingObject = Chats.findOne({
    '_id': this._id,
    'started_typing.upper_id': userId,
  });
  if (typingObject) {
    Chats.update(
      { '_id': this._id, 'started_typing.upper_id': userId },
      { $set: { 'started_typing.$.date': typingDate } }
    );
  } else {
    Chats.update(this._id, {
      $push: { started_typing: { upper_id: userId, date: typingDate } },
    });
  }
};

/**
 * Unset a typing user
 *
 * @memberOf Chats
 * @param {String} userId the id of the user that stopped typing
 */
Chat.prototype.stoppedTyping = function(userId) {
  Chats.update(this._id, { $pull: { started_typing: { upper_id: userId } } });
};

/**
 * Add a user to the counter array
 *
 * @memberOf Chats
 * @param {String} userId the id of the user that needs to be added
 */
Chat.prototype.addUserToCounter = function(userId) {
  Chats.update(
    {
      '_id': this._id,
      'counter.user_id': {
        $ne: userId,
      },
    },
    {
      $push: {
        counter: {
          user_id: userId,
          unread_count: 0,
        },
      },
    }
  );
};

/**
 * Increment unread messages counter
 *
 * @memberOf Chats
 * @param {String} creatorUserId the id of the creator of a message
 */
Chat.prototype.incrementCounter = function(creatorUserId) {
  let chat = Chats.findOneOrFail(this._id);

  // The counter array is sporadically empty, so fix that
  if (chat.counter.length < 1) {
    let chatUppers = Meteor.users
      .find({ chats: { $in: [this._id] } }, { fields: { _id: 1 } })
      .map(function(upper) {
        return upper._id;
      });

    let self = this;
    chatUppers.forEach(function(upperId) {
      self.addUserToCounter(upperId);
    });

    // Re-fetch chat object for further operations
    chat = Chats.findOneOrFail(this._id);
  }

  chat.counter.forEach(function(counter) {
    if (counter.user_id === creatorUserId) return;
    counter.unread_count++;
  });

  Chats.update(this._id, { $set: { counter: chat.counter } });
};

/**
 * Reset unread messages counter
 *
 * @memberOf Chats
 * @param {String} userId the id of the user to reset
 */
Chat.prototype.resetCounterForUser = function(userId) {
  Chats.update(
    {
      '_id': this._id,
      'counter.user_id': userId,
    },
    {
      $set: {
        'counter.$.unread_count': 0,
      },
    }
  );
};

/**
 * Remove a user from the counter array
 *
 * @memberOf Chats
 * @param {String} userId the id of the user that needs to be removed
 */
Chat.prototype.removeUserFromCounter = function(userId) {
  Chats.update(
    {
      '_id': this._id,
      'counter.user_id': userId,
    },
    {
      $pull: { counter: { user_id: userId } },
    }
  );
};

/**
 @namespace Chats
 */
Chats = new Mongo.Collection('chats', {
  transform: function(document) {
    return new Chat(document);
  },
});

/**
 * Find chats for a single user
 *
 * @memberOf Chats
 * @param {String} userId
 * @param {Object} parameters
 * @param {Boolean} parameters.private Set true when you need to incluce the private chats
 * @param {Boolean} parameters.networks Set true when you need to incluce the network chats
 * @param {Object} options
 * @return {Mongo.Cursor}
 */
Chats.findForUser = function(userId, parameters, options) {
  options = options || {};
  parameters = parameters || {};
  let user = Meteor.users.findOne(userId);
  if (!user) return;
  let chatIds = [];

  if (parameters.private) {
    // Add the private chats
    let userChats = user.chats || [];
    chatIds = chatIds.concat(userChats);
  }

  if (parameters.networks) {
    // And now collect the tribe chats
    let userNetworks = user.networks || [];
    let networks = Networks.find({
      _id: { $in: userNetworks },
      archived_at: { $exists: false },
    });
    networks.forEach(function(network) {
      if (network.chat_id) chatIds.push(network.chat_id);
    });
  }

  if (!options.sort) {
    options.sort = { updated_at: -1 };
  }

  // Return the IDs ordered by most recent
  return Chats.find({ _id: { $in: chatIds } }, options);
};

/**
 * Find chats for a single user
 *
 * @memberOf Chats
 * @param {String} userId
 * @param {Object} parameters
 * @param {Boolean} parameters.private Set true when you need to incluce the private chats
 * @param {Boolean} parameters.networks Set true when you need to incluce the network chats
 * @param {Object} options
 * @return {Mongo.Cursor}
 */
Chats.findOneForUser = function(userId, chatId, options) {
  options = options || {};

  let user = Meteor.users.findOne(userId);
  if (!user) return;

  if (!user.chats.indexOf(chatId) === -1) return;

  if (!options.sort) {
    options.sort = { updated_at: -1 };
  }

  // Return the IDs ordered by most recent
  return Chats.find({ _id: chatId }, options);
};

/**
 * Remove a chat and all of its messages
 *
 * @memberOf Chats
 * @param {String} chatId
 */
Chats.removeFull = function(chatId) {
  let chat = Chats.findOneOrFail(chatId);

  ChatMessages.remove({ chat_id: chatId });
  Chats.remove({ _id: chatId });
};

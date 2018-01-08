Meteor.methods({
  /**
   * Insert a Message
   *
   * @param {string} partupId
   * @param {mixed[]} fields
   */
  'updates.messages.insert': function(partupId, fields) {
    check(partupId, String);
    check(fields, Partup.schemas.forms.message);

    this.unblock();

    let upper = Meteor.user();
    if (!upper) throw new Meteor.Error(401, 'unauthorized');

    let partup = Partups.findOneOrFail(partupId);
    let newMessage = Partup.transformers.update.fromFormNewMessage(
      fields,
      upper,
      partup._id
    );
    newMessage.type = 'partups_message_added';

    try {
      newMessage._id = Updates.insert(newMessage);

      // Make user Supporter if it's not yet an Upper or Supporter of the Partup
      if (!partup.hasUpper(upper._id) && !partup.hasSupporter(upper._id)) {
        partup.makeSupporter(upper._id);

        Event.emit('partups.supporters.inserted', partup, upper);
      }

      Event.emit(
        'partups.messages.insert',
        upper,
        partup,
        newMessage,
        fields.text
      );
      let mentionsWarning = Partup.helpers.mentions.exceedsLimit(fields.text);
      return {
        _id: newMessage._id,
        warning: mentionsWarning || undefined,
      };
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'message_could_not_be_inserted');
    }
  },

  /**
   * Update a Message
   *
   * @param {string} updateId
   * @param {mixed[]} fields
   */
  'updates.messages.update': function(updateId, messageData) {
    check(updateId, String);
    check(messageData, Partup.schemas.forms.message);

    this.unblock();

    if (Meteor.user()) {
      try {
        const message = Updates.findOne({
          _id: updateId,
          upper_id: Meteor.userId(),
        });
        if (message) {
          // If for some reason there are files that have not yet been removed by the controller we still have to do it here.
          const { images, documents } = messageData;
          const hasUrl = messageData.text.match(
            /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
          );

          if (message.type_data && message.type_data.images) {
            const oldImageIds = _.difference(message.type_data.images, images);
            if (oldImageIds.length) {
              _.each(oldImageIds, (id) => {
                Meteor.call('images.remove', id, function(error) {
                  if (error) {
                    throw error;
                  }
                });
              });
            }
          }
          if (message.type_data && message.type_data.documents) {
            const oldDocumentIds = _.difference(
              message.type_data.documents,
              documents
            );
            if (oldDocumentIds.length) {
              _.each(oldDocumentIds, (id) => {
                Meteor.call('files.remove', id, function(error) {
                  if (error) {
                    throw error;
                  }
                });
              });
            }
          }

          Updates.update(
            { _id: message._id },
            {
              $set: {
                type_data: {
                  old_value: message.type_data.new_value,
                  new_value: messageData.text,
                  images: messageData.images,
                  documents: messageData.documents,
                },
                has_documents: !!documents,
                has_links: !!hasUrl,
                updated_at: new Date(),
              },
            }
          );
        } else {
          throw new Meteor.Error(0, `cannot find message with _id ${updateId}`);
        }
      } catch (error) {
        Log.error(error);
        throw new Meteor.Error(error);
      }
    }
  },

  /**
   * Remove a message
   *
   * @param {string} messageId
   */
  'updates.messages.remove': function(messageId) {
    check(messageId, String);

    this.unblock();

    let upper = Meteor.user();
    if (!upper) throw new Meteor.Error(401, 'unauthorized');

    try {
      let message = Updates.findOne({
        _id: messageId,
        upper_id: upper._id,
      });
      if (message) {
        // Don't remove when message has comments
        if (message.comments && message.comments.length > 0) {
          throw new Meteor.Error(400, 'partup_message_already_has_comments');
        }

        // Check for attachments
        let files = message.type_data.files || [];
        if (files.length > 0) {
          files.forEach(function(fileId) {
            Partup.server.services.files.remove(fileId);
          });
        }

        Updates.remove({ _id: message._id });
      }
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'partup_message_could_not_be_removed');
    }
  },

  /**
   * Star an update message.
   *
   * @param {string} messageId
   */
  'updates.messages.star': function(messageId) {
    check(messageId, String);

    this.unblock();

    const upper = Meteor.user();

    const message = Updates.findOne(
      { _id: messageId },
      { field: { _id: 1, partup_id: 1 } }
    );
    const partupId = message.partup_id;
    const partup = Partups.findOne(partupId, {
      fields: { starred_updates: 1 },
    });

    if (
      !message ||
      !partup ||
      !upper ||
      !User(upper).isPartnerInPartup(partupId)
    ) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    if (partup.starred_updates && partup.starred_updates.length >= 5) {
      throw new Meteor.Error(400, 'partup_message_too_many_stars');
    }

    try {
      Partups.update(partupId, {
        $push: { starred_updates: message._id },
      });
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'partup_message_could_not_be_starred');
    }
  },

  /**
   * Star an update message.
   *
   * @param {string} messageId
   */
  'updates.messages.unstar': function(messageId) {
    check(messageId, String);

    this.unblock();

    const upper = Meteor.user();

    const message = Updates.findOne(
      { _id: messageId },
      { field: { _id: 1, partup_id: 1 } }
    );
    const partupId = message.partup_id;

    if (!message || !upper || !User(upper).isPartnerInPartup(partupId)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      Partups.update(partupId, {
        $pull: { starred_updates: message._id },
      });
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'partup_message_could_not_be_starred');
    }
  },
});

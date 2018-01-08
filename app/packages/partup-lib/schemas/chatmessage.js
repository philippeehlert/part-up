/**
 * Base ChatMessage schema
 * @name chatMessageBaseSchema
 * @memberof Partup.schemas
 * @private
 */
let chatMessageBaseSchema = new SimpleSchema({
  chat_id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  content: {
    type: String,
    min: 1,
    max: 1000,
  },
});

/**
 * ChatMessage entity schema
 * @name chatMessage
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.chatMessage = new SimpleSchema([
  chatMessageBaseSchema,
  {
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    created_at: {
      type: Date,
      defaultValue: new Date(),
    },
    creator_id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    read_by: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
    },
    seen_by: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
    },
    updated_at: {
      type: Date,
      defaultValue: new Date(),
    },
  },
]);

/**
 * ChatMessage form schema
 * @name chatMessage
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.chatMessage = new SimpleSchema([
  chatMessageBaseSchema,
  {
    //
  },
]);

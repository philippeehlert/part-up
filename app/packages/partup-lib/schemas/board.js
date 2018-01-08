/**
 * Base Board schema
 * @name boardBaseSchema
 * @memberof Partup.schemas
 * @private
 */
let boardBaseSchema = new SimpleSchema({
  lanes: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
  },
});

/**
 * Board entity schema
 * @name board
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.board = new SimpleSchema([
  boardBaseSchema,
  {
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    created_at: {
      type: Date,
      defaultValue: new Date(),
    },
    partup_id: {
      type: String,
      optional: true,
      regEx: SimpleSchema.RegEx.Id,
    },
    updated_at: {
      type: Date,
      defaultValue: new Date(),
    },
  },
]);

/**
 * Board form schema
 * @name board
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.board = new SimpleSchema([
  boardBaseSchema,
  {
    //
  },
]);

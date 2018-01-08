/**
 * Base Lane schema
 * @name laneBaseSchema
 * @memberof Partup.schemas
 * @private
 */
let laneBaseSchema = new SimpleSchema({
  activities: {
    type: [String],
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    optional: true,
  },
});

/**
 * Lane entity schema
 * @name lane
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.lane = new SimpleSchema([
  laneBaseSchema,
  {
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    board_id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    created_at: {
      type: Date,
      defaultValue: new Date(),
    },
    updated_at: {
      type: Date,
      defaultValue: new Date(),
    },
  },
]);

/**
 * Lane form schema
 * @name lane
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.lane = new SimpleSchema([
  laneBaseSchema,
  {
    //
  },
]);

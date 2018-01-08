/**
 @namespace Lane transformer service
 @name partup.transformers.lane
 @memberof Partup.transformers
 */
Partup.transformers.lane = {
  /**
   * Transform form to lane
   *
   * @memberof Partup.transformers.lane
   * @param {mixed[]} fields
   */
  fromForm: function(fields) {
    return {
      activities: fields.activities,
      name: fields.name,
      updated_at: new Date(),
    };
  },
};

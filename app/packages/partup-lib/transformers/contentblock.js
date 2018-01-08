/**
 @namespace ContentBlock transformer service
 @name partup.transformers.contentBlock
 @memberof Partup.transformers
 */
Partup.transformers.contentBlock = {
  /**
   * Transform contentBlock object to contentBlock form data
   *
   * @memberof Partup.transformers.contentBlock
   * @param {object} contentBlock
   */
  toFormContentBlock: function(contentBlock) {
    return {
      _id: contentBlock._id,
      title: contentBlock.title,
      text: contentBlock.text,
      image: contentBlock.image,
    };
  },

  /**
   * Transform contentBlock form to contentBlock object
   *
   * @memberof Partup.transformers.contentBlock
   * @param {mixed[]} fields
   */
  fromFormContentBlock: function(fields) {
    let data = {
      type: fields.type,
    };

    if (fields.title) data.title = sanitizeHtml(fields.title);
    if (fields.text) data.text = sanitizeHtml(fields.text);

    if (fields.image) data.image = fields.image;

    return data;
  },
};

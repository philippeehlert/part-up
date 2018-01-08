let slugify = Npm.require('slug');
let d = Debug('services:slugify');

/**
 @namespace Partup server slugify service
 @name Partup.server.services.slugify
 @memberof Partup.server.services
 */
Partup.server.services.slugify = {
  /**
   * Slugify a string
   *
   * @param  {String} value
   *
   * @return {String}
   */
  slugify: function(value) {
    let slug = slugify(value).toLowerCase();

    d('Slugified [' + value + '] to [' + slug + ']');

    return slug;
  },

  /**
   * Generate a slug in the following form:
   *
   * {slugified-property-value}-{document-id}
   *
   * Example: lifely-s-partup-12345
   *
   * @param  {Document} document
   * @param  {string} property
   */
  slugifyDocument: function(document, property) {
    let value = document[property];
    let slug = slugify(value).toLowerCase() + '-' + document._id;

    d('Slugified [' + value + '] to [' + slug + ']');

    return slug;
  },
};

/**
 * Sector model
 *
 * @memberOf Sectors
 */
let Sector = function(document) {
  _.extend(this, document);
};

/**
 @namespace Sectors
 @name Sectors
 */
Sectors = new Mongo.Collection('sectors', {
  transform: function(document) {
    return new Sector(document);
  },
});

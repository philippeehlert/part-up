/**
 * @ignore
 */
let ContentBlock = function(document) {
  _.extend(this, document);
};

/**
 @namespace ContentBlocks
 @name ContentBlocks
 */
ContentBlocks = new Mongo.Collection('contentblocks', {
  transform: function(document) {
    return new ContentBlock(document);
  },
});

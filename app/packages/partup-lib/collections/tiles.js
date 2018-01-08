/**
 * @ignore
 */
let Tile = function(document) {
  _.extend(this, document);
};

/**
 * Returns the embedsettings for vimeo or youtube
 *
 * @memberof Tiles
 * @return {Object} embed type and type id
 */
Tile.prototype.embedSettings = function() {
  let settings = {};
  // Vimeo settings
  if (this.video_url.indexOf('vimeo') > -1) {
    settings.type = 'vimeo';
    settings.vimeo_id = Partup.helpers.url.getVimeoIdFromUrl(this.video_url);
  }
  // YouTube settings
  if (
    this.video_url.indexOf('youtube') > -1 ||
    this.video_url.indexOf('youtu.be') > -1
  ) {
    settings.type = 'youtube';
    settings.youtube_id = Partup.helpers.url.getYoutubeIdFromUrl(
      this.video_url
    );
  }
  return settings;
};

/**
 @namespace Tiles
 @name Tiles
 */
Tiles = new Mongo.Collection('tiles', {
  transform: function(document) {
    return new Tile(document);
  },
});

// Add indices
if (Meteor.isServer) {
  Tiles._ensureIndex('upper_id');
}

let MetaInspector = Npm.require('node-metainspector');
let d = Debug('services:scrape');

/**
 @namespace Partup server scrape service
 @name Partup.server.services.scrape
 @memberof Partup.server.services
 */
Partup.server.services.scrape = {
  /**
   * Get scraped data from a URL
   * @param {String} url
   * @return {Object}
   */
  website: function(url) {
    let scraper = Meteor.wrapAsync(function(url, callback) {
      let client = new MetaInspector(url, {
        timeout: 5000,
        limit: 200000,
      });

      client.on('fetch', function() {
        return callback(null, client);
      });

      client.on('error', function(error) {
        return callback(Log.error(error));
      });

      client.fetch();
    });

    return scraper(url);
  },
};

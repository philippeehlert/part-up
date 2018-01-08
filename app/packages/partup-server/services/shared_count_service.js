let d = Debug('services:shared_count');

/**
 @namespace Partup server shared count service
 @name Partup.server.services.shared_count
 @memberof Partup.server.services
 */
Partup.server.services.shared_count = {
  facebook: function(url) {
    let response = HTTP.get('http://graph.facebook.com/?id=' + url);

    if (response.statusCode !== 200) {
      Log.error(
        'Facebook Graph API resulted in status code [' +
          response.statusCode +
          ']',
        response
      );
      return false;
    }

    let data = mout.object.get(response, 'data');
    if (!data) return false;

    return data.shares ? data.shares : 0;
  },

  linkedin: function(url) {
    let response = HTTP.get(
      'https://www.linkedin.com/countserv/count/share?format=json&url=' + url
    );

    if (response.statusCode !== 200) {
      Log.error(
        'LinkedIn shared count API resulted in status code [' +
          response.statusCode +
          ']',
        response
      );
      return false;
    }

    let data = mout.object.get(response, 'data');
    if (!data) return false;

    return data.count;
  },
};

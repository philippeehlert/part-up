let d = Debug('services:cache');

let cache = {};

/**
 @namespace Partup server cache service
 @name Partup.server.services.cache
 @memberof Partup.server.services
 */
Partup.server.services.cache = {
  set: function(key, value, ttl) {
    ttl = ttl || false;

    let data = {
      value: value,
      ttl: ttl * 1000,
      timestamp: Date.now(),
    };

    d('Cache value written [' + key + ']');

    mout.object.set(cache, key, data);
  },

  get: function(key) {
    let data = mout.object.get(cache, key);

    if (data) {
      d('Cache value read [' + key + ']');

      return data.value;
    }
  },

  has: function(key) {
    let data = mout.object.get(cache, key);

    if (!data) return false;

    if (data.ttl && data.timestamp + data.ttl < Date.now()) {
      mout.object.unset(cache, key);

      return false;
    }

    return true;
  },

  clear: function() {
    cache = {};
  },
};

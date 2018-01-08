let url = Npm.require('url');

let apiRoot = process.env.API_ROOT_URL;
let apiKey = process.env.API_KEY;
let apiOpts = { headers: { apikey: apiKey } };
let apiSecure = apiRoot && url.parse(apiRoot).protocol === 'https';

// Check event endpoint config
if (!apiRoot || !apiKey) {
  Log.warn('Partup API not configured, missing api root or api key.');
}

/**
 * @ignore
 */
let _Api = function(document) {
  _.extend(this, document);
};

_Api.prototype.available = apiRoot && apiKey;

_Api.prototype.call = function(method, path, options, cb) {
  let reqOpts = options ? _.merge({}, apiOpts, options) : apiOpts;
  return HTTP.call(method, url.resolve(apiRoot, path), reqOpts, cb);
};

_Api.prototype.get = function(path, options, cb) {
  return this.call('GET', path, options, cb);
};

_Api.prototype.post = function(path, options, cb) {
  return this.call('POST', path, options, cb);
};

_Api.prototype.isSecure = function() {
  return apiSecure;
};

Api = new _Api();

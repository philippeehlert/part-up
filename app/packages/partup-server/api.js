var url = Npm.require('url');

var apiRoot = process.env.API_ROOT_URL;
var apiKey = process.env.API_KEY;
var apiOpts = { headers: { apikey: apiKey } };
var apiSecure = url.parse(apiRoot).protocol === 'https';

// Check event endpoint config
if (!apiRoot || !apiKey) {
    Log.warn('Partup API not configured, missing api root or api key.');
}

/**
 * @ignore
 */
var _Api = function(document) {
    _.extend(this, document);
};

_Api.prototype.available = apiRoot && apiKey;

_Api.prototype.call = function(method, path, options, cb) {
    var reqOpts = options ? _.merge({}, apiOpts, options) : apiOpts;
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
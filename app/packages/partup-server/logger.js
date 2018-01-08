let winston = Npm.require('winston');

let options = {};

if (process.env.NODE_ENV === 'development') {
  options.prettyPrint = true;
  options.colorize = true;
  options.debugStdout = true;
} else {
  options.json = false;
}

if (process.env.NODE_ENV.match(/development|staging|acceptance/)) {
  options.level = 'debug';
}

if (process.env.NODE_ENV === 'production') {
  options.level = 'warn';
}

Log = new winston.Logger({
  transports: [new winston.transports.Console(options)],
});

Debug = function(namespace) {
  let debug = Npm.require('debug')('partup:' + namespace);
  debug.log = console.info.bind(console);
  debug.useColors = true;
  return debug;
};

LogFunc = function(opts) {
  message = opts.message;
  if (opts.tag) {
    message = opts.tag + ': ' + message;
  }
  Log.log(opts.level, message);
};

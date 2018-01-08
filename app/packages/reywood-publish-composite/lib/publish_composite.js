Meteor.publishComposite = function(name, options, httpOptions) {
  return Meteor.publish(
    name,
    function() {
      let subscription = new Subscription(this);
      let args = Array.prototype.slice.apply(arguments);
      let instanceOptions = prepareOptions.call(this, options, args);
      let pubs = [];

      _.each(instanceOptions, function(opt) {
        let pub = new Publication(subscription, opt);
        pub.publish();
        pubs.push(pub);
      });

      this.onStop(function() {
        _.each(pubs, function(pub) {
          pub.unpublish();
        });
      });

      this.ready();
    },
    httpOptions
  );
};

debugLog = function() {};

Meteor.publishComposite.enableDebugLogging = function() {
  debugLog = function(source, message) {
    while (source.length < 35) {
      source += ' ';
    }
    console.log('[' + source + '] ' + message);
  };
};

var prepareOptions = function(options, args) {
  let preparedOptions = options;

  if (typeof preparedOptions === 'function') {
    preparedOptions = preparedOptions.apply(this, args);
  }

  if (!preparedOptions) {
    return [];
  }

  if (!_.isArray(preparedOptions)) {
    preparedOptions = [preparedOptions];
  }

  return preparedOptions;
};

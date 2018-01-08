let d = Debug('event_handlers');

/**
 * Log every event fired by the application including it's arguments
 */
Event.onAny(function() {
  d('Event fired', this.event);

  if (process.env.LOG_EVENTS) {
    Log.debug('Event fired: '.white + this.event.magenta, arguments);
  }

  if (Api.available) {
    let data = {
      timestamp: new Date().toISOString(),
      eventname: this.event,
      payload: arguments,
    };
    Api.post(
      'events',
      {
        data: data,
        npmRequestOptions: {
          rejectUnauthorized: false,
        },
      },
      function(err, result) {
        if (err && process.env.LOG_EVENTS) {
          Log.error('Could not push event to store.');
          Log.error(err);
          Log.error(result);
        } else {
          // silently ignore success of posting to eventstore
        }
      }
    );
  }
});

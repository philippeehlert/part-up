Meteor.methods({
  /**
   * Register a click on a Partup
   *
   * @param {string} partupId
   */
  'partups.analytics.click': function(partupId) {
    check(partupId, String);

    let partup = Partups.findOneOrFail(partupId);
    let hour = new Date().getHours();

    let user = Meteor.user();

    let ip = this.connection.clientAddress;
    let last_ip = mout.object.get(partup, 'analytics.last_ip');

    if (user) {
      Event.emit('partups.analytics.click', partup._id, user._id);
    }

    if (ip === last_ip) return;

    let clicks_per_hour =
      mout.object.get(partup, 'analytics.clicks_per_hour') ||
      new Array(25)
        .join('0')
        .split('')
        .map(parseFloat);
    let clicks_total = mout.object.get(partup, 'analytics.clicks_total') || 0;
    let clicks_per_day =
      mout.object.get(partup, 'analytics.clicks_per_day') || 0;

    clicks_per_hour[hour] = parseInt(clicks_per_hour[hour] + 1);
    clicks_total++;

    if (!clicks_per_hour.length) return;

    clicks_per_day = clicks_per_hour.reduce(function(result, clicks) {
      return result + clicks;
    });

    Partups.update(
      { _id: partupId },
      {
        $set: {
          'analytics.clicks_total': clicks_total,
          'analytics.clicks_per_day': clicks_per_day,
          'analytics.clicks_per_hour': clicks_per_hour,
          'analytics.last_ip': ip,
        },
      }
    );
  },
});

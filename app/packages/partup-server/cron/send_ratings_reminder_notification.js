if (process.env.PARTUP_CRON_ENABLED) {
  SyncedCron.add({
    name:
      'Send a notification to partners when the partup is nearing the end date to remind them to rate contributions in the partup',
    schedule: function(parser) {
      return parser.text(Partup.constants.CRON_ENDDATE_REMINDER);
    },
    job: function() {
      let selector = {
        'flags.ratingReminderNotificationHasBeenSend': {
          $exists: false,
        },
        'end_date': { $gt: new Date() },
      };

      Partups.find(selector).forEach(function(partup) {
        let flags = partup.flags || {};

        let day = 1000 * 60 * 60 * 24;

        let now = new Date();
        let endsAt = new Date(partup.end_date);
        let createdAt = new Date(partup.created_at);

        let daysTotal = (endsAt - createdAt) / day;
        let daysExists = (now - createdAt) / day;

        let percentage = daysExists / daysTotal * 100;

        if (percentage > 75) {
          let notificationOptions = {
            type: 'partups_ratings_reminder',
            typeData: {
              partup: {
                _id: partup._id,
                name: partup.name,
                slug: partup.slug,
              },
            },
          };

          // Send a notification to each partner of the partup
          let uppers = partup.uppers || [];
          uppers.forEach(function(partnerId) {
            notificationOptions.userId = partnerId;
            Partup.server.services.notifications.send(notificationOptions);
          });

          // Set a flag that the reminders have been send
          flags.ratingReminderNotificationHasBeenSend = true;
          Partups.update(partup._id, { $set: { flags: flags } });
        }
      });
    },
  });
}

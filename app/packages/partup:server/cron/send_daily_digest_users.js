SyncedCron.add({
    name: 'Send daily notification email digest',
    schedule: function(parser) {
        return parser.text(Partup.constants.DIGEST_FREQUENCY);
    },
    job: function() {
        var counter = 0;
        Meteor.users.find({
            'flags.dailyDigestEmailHasBeenSent': false,
            'profile.settings.email.dailydigest': true
        }).forEach(function(user) {
            var newNotifications = Notifications.findForUser(user, {'new':true}).fetch();
            if (newNotifications.length > 0) {

                // Set the email details
                var emailOptions = {
                    type: 'dailydigest',
                    toAddress: User(user).getEmail(),
                    subject: 'Notifications Part-up.com',
                    locale: User(user).getLocale(),
                    typeData: {
                        name: User(user).getFirstname(),
                        notificationCount: newNotifications.length,
                        url: Meteor.absoluteUrl()
                    },
                    userEmailPreferences: user.profile.settings.email
                };

                // Send the email
                Partup.server.services.emails.send(emailOptions);

                Meteor.users.update(user._id, {'$set': {'flags.dailyDigestEmailHasBeenSent': true}});
                counter++;
            }
        });
        console.log(counter + ' users were mailed with notification digest');
    }
});

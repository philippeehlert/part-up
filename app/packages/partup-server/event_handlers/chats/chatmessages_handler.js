/**
 * Check for scrapable content
 */

Event.on('chats.messages.inserted', function(upper, chatMessage, network) {
    if (!upper || !chatMessage) return;

    // Send mention notifications in network chat
    if (network) {
        // Parse message for user mentions
        var limitExceeded = Partup.helpers.mentions.exceedsLimit(chatMessage.content);
        var mentions = Partup.helpers.mentions.extract(chatMessage.content);
        var notificationType = 'upper_mentioned_in_network_chat';

        var process = function(user) {
            if (!User(user).isActive()) return; // Ignore deactivated accounts

            // Set the notification details
            var notificationOptions = {
                userId: user._id,
                type: notificationType,
                typeData: {
                    mentioning_upper: {
                        _id: upper._id,
                        name: upper.profile.name,
                        image: upper.profile.image
                    },
                    chat_message: {
                        _id: chatMessage._id
                    },
                    network: {
                        _id: network._id,
                        name: network.name,
                        slug: network.slug
                    }
                }
            };

            // Send the notification
            Partup.server.services.notifications.send(notificationOptions);

            // Set the email details
            var emailOptions = {
                type: notificationType,
                toAddress: User(user).getEmail(),
                subject: TAPi18n.__('emails-' + notificationType + '-subject', {network: network.name}, User(user).getLocale()),
                locale: User(user).getLocale(),
                typeData: {
                    name: User(user).getFirstname(),
                    mentioningUpper: upper.profile.name,
                    networkName: network.name,
                    url: Meteor.absoluteUrl() + 'tribes/' + network.slug + '/chat#' + chatMessage._id,
                    unsubscribeOneUrl: Meteor.absoluteUrl() + 'unsubscribe-email-one/' + notificationType + '/' + user.profile.settings.unsubscribe_email_token,
                    unsubscribeAllUrl: Meteor.absoluteUrl() + 'unsubscribe-email-all/' + user.profile.settings.unsubscribe_email_token
                },
                userEmailPreferences: user.profile.settings.email
            };

            // Send the email
            Partup.server.services.emails.send(emailOptions);

        };

        if (!limitExceeded) {
            mentions.forEach(function(mention) {
                if (mention.type === 'single') {
                    // Retrieve the user from the database (ensures that the user does indeed exists!)
                    if (mention._id === upper._id) return;
                    var user = Meteor.users.findOne(mention._id);
                    process(user);
                }
            });
        }

        // Check if an URL is present
        // var url = chatMessage.content.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);

        // if (url && url.length > 0) {
        //     var matchedUrl = url[0];
        //     var data = Partup.server.services.scrape.website(matchedUrl);

        //     // Stop if there is no scraped data
        //     if (!data) return;

        //     // Scrape again with seo snippets available for partup routes
        //     if (data.host == 'part-up.com') {
        //         data = Partup.server.services.scrape.website(matchedUrl + '?_escaped_fragment_');
        //         // If still not available (like on a /chat route), scrape the part-up root page
        //         if (!data || !data.title) return;

        //         if (!data.description) {
        //             data = Partup.server.services.scrape.website('https://part-up.com/?_escaped_fragment_');
        //         }
        //         // Change the URL to link to back to the original URL
        //         data.url = matchedUrl;
        //     }

        //     var preview_data = {};

        //     var isImage = function(url) {
        //         return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
        //     };

        //     if (data.title) {
        //         preview_data.url = data.url;
        //         preview_data.title = data.ogTitle ? data.ogTitle : data.title;
        //         preview_data.description = data.ogDescription ? data.ogDescription : data.description ? data.description : undefined;
        //         preview_data.image = data.image ? data.image : data.images[0];
        //         preview_data.domain = data.host ? data.host : null;
        //     } else if (isImage(matchedUrl)) {
        //         preview_data.url = data.url;
        //         preview_data.type = 'image';
        //     } else {
        //         return;
        //     }

        //     ChatMessages.update(chatMessage._id, {$set: {preview_data: preview_data}});
        // }
    }
});

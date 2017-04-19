Package.describe({
    name: 'partup-client-dropdowns',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'meteorhacks:subs-manager'
    ], ['client', 'server']);

    api.use([
        'templating',
        'partup-lib',
        'reactive-var'
    ], 'client');

    api.addFiles([

        'dropdowns.js',

        'notifications/notifications.html',
        'notifications/notifications.js',
        'notifications/notification/notification.html',
        'notifications/notification/notification.js',

        'notifications/notification/types/network/accepted.html',
        'notifications/notification/types/network/invite.html',
        'notifications/notification/types/network/member-left.html',
        'notifications/notification/types/network/new-member.html',
        'notifications/notification/types/network/new-pending-upper.html',
        'notifications/notification/types/network/partup-created.html',
        'notifications/notification/types/network/upper-mentioned-in-chat.html',

        'notifications/notification/types/partup/activities-invited.html',
        'notifications/notification/types/partup/contribution-accepted.html',
        'notifications/notification/types/partup/contribution-rating.html',
        'notifications/notification/types/partup/contribution-rejected.html',
        'notifications/notification/types/partup/multiple-new-comment-conversation.html',
        'notifications/notification/types/partup/multiple-new-updates.html',
        'notifications/notification/types/partup/multiple-new-uppers.html',
        'notifications/notification/types/partup/new-activity.html',
        'notifications/notification/types/partup/new-comment-conversation.html',
        'notifications/notification/types/partup/new-contribution-proposed.html',
        'notifications/notification/types/partup/new-contribution.html',
        'notifications/notification/types/partup/new-message.html',
        'notifications/notification/types/partup/reminder-ratings.html',
        'notifications/notification/types/partup/supporters-added.html',
        'notifications/notification/types/partup/update-comment.html',
        'notifications/notification/types/partup/upper-invite.html',
        'notifications/notification/types/partup/user-mention.html',
        'notifications/notification/types/partup/archived.html',
        'notifications/notification/types/partup/unarchived.html',
        'notifications/notification/types/partup/partner-request.html',
        'notifications/notification/types/partup/partner-accepted.html',
        'notifications/notification/types/partup/partner-rejected.html',

        'chats/chat-notifications.html',
        'chats/chat-notifications.js',
        'chats/notification/chat-group-notification.html',
        'chats/notification/chat-group-notification.js',
        'chats/notification/chat-1-on-1-notification.html',
        'chats/notification/chat-1-on-1-notification.js',

        'menu/menu.html',
        'menu/menu.js',

        'language-selector/language-selector.html',
        'language-selector/language-selector.js',

        'tribes/tribes.html',
        'tribes/tribes.js',

        'network-header/network-header.html',
        'network-header/network-header.js',

        'profile/profile.html',
        'profile/profile.js',

        'partials/partup/updates-actions.html',
        'partials/partup/updates-actions.js',
        'partials/partup/activities-actions.html',
        'partials/partup/activities-actions.js',
        'partials/partup/navigation.html',
        'partials/partup/navigation.js',
        'partials/partup/cog-header.html',
        'partials/partup/cog-header.js',

        'partials/network/network-actions.html',
        'partials/network/network-actions.js',
        'partials/network/navigation.html',
        'partials/network/navigation.js',

        'partials/profile/upper-actions.html',
        'partials/profile/upper-actions.js',
        'partials/profile/supporter-actions.html',
        'partials/profile/supporter-actions.js',
        'partials/profile/navigation.html',
        'partials/profile/navigation.js',

        'partials/discover/language-selector.html',
        'partials/discover/language-selector.js',
        'partials/discover/sort-selector.html',
        'partials/discover/sort-selector.js',

        'partials/discover/tribes/type-selector.html',
        'partials/discover/tribes/type-selector.js',
        'partials/discover/tribes/sector-selector.html',
        'partials/discover/tribes/sector-selector.js',

        'partials/discover/partups/tribe-selector.html',
        'partials/discover/partups/tribe-selector.js',

        'expander/expander.html',
        'expander/expander.js',
        'expander/toggler.html',
        'expander/toggler.js'
    ], 'client');

});

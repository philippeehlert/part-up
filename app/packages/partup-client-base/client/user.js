/**
 * Client user helpers
 *
 * @class user
 * @memberOf Partup.client
 */
var beforeLogoutCallBacks = [];
Partup.client.user = {
    logout: function() {
        var Intercom = Intercom || undefined;

        if (Intercom) Intercom('shutdown');

        // before logout callbacks, to prevent errors
        beforeLogoutCallBacks.forEach(function(cb) {
            cb();
        });
        Partup.client.chatData.clear();
        lodash.defer(function() {
            Meteor.logout();
        });
    },
    onBeforeLogout: function(cb) {
        beforeLogoutCallBacks.push(cb);
    },
    offBeforeLogout: function(cb) {
        var index = beforeLogoutCallBacks.indexOf(cb);
        if (index > -1) beforeLogoutCallBacks.splice(index, 1);
    }
};

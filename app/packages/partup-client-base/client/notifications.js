Partup.client.notifications = {
  createTitle: function(string) {
    let user = Meteor.user();
    if (!user) return string;
    let unreadNotifications = Notifications.findForUser(user, {
      new: true,
    }).count();
    if (!unreadNotifications) return string;
    return '(' + unreadNotifications + ') ' + string;
  },
};

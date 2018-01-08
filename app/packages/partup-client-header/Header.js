Template.Header.helpers({
  scrollTop: function() {
    let scrollPosition = Partup.client.scroll.pos.get();

    return scrollPosition <= 0;
  },
});

Template.Header_LoggedIn.helpers({
  notificationslabel: function() {
    return TAPi18n.__('header-notifications');
  },
  chatlabel: function() {
    return TAPi18n.__('header-chat');
  },
});

Template.Header_LoggedOut.events({
  'click [data-login]': function(event) {
    event.preventDefault();
    Intent.go({ route: 'login' });
  },
  'click [data-register]': function(event) {
    event.preventDefault();
    Intent.go({ route: 'register' });
  },
});

Template.Header_Tribes.helpers({
  showDiscover: function(user) {
    if (!user) return true;
    return (
      !User(user).isMemberOfAnyNetwork() && !User(user).isMemberOfAnyPartup()
    );
  },
});

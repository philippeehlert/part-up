Template.registerHelper('currentUserId', function() {
  let user = Meteor.user();
  if (!user) return;

  return user._id;
});

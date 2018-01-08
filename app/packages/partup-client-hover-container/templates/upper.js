Template.HoverContainer_upper.onCreated(function() {
  let userId = this.data;
  this.subscribe('users.one', userId);
});

Template.HoverContainer_upper.helpers({
  user: function() {
    let userId = Template.instance().data;
    let user = Meteor.users.findOne(userId) || null;
    if (!user) return;

    let image = Images.findOne(user.profile.image);
    if (!image) return;

    Partup.client.embed.user(user, [image]);

    return user;
  },
});

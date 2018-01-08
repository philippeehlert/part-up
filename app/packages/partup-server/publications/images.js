/**
 * Publish an image
 *
 * @param {String} networkId
 */
Meteor.publish('images.one', function(imageId) {
  check(imageId, String);

  this.unblock();

  return Images.find({ _id: imageId }, { limit: 1 });
});

Meteor.publish('images.many', function() {
  this.unblock();

  if (Meteor.user()) {
    return Images.find();
  }
  throw new Meteor.Error(0, 'unauthorized');
});

Meteor.publish('contributions.for_activity', function(activityId) {
  check(activityId, String);
  this.unblock();

  return Contributions.find({ activity_id: activityId });
});

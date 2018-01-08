Event.on('partups.location.changed', function(userId, partup, value) {
  if (!userId) return;

  let updateType = 'partups_location_changed';
  let updateTypeData = {
    old_location: value.old,
    new_location: value.new,
  };

  let update = Partup.factories.updatesFactory.make(
    userId,
    partup._id,
    updateType,
    updateTypeData
  );

  Updates.insert(update);
});

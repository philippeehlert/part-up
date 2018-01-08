Event.on('partups.description.changed', function(userId, partup, value) {
  if (!userId) return;

  let updateType = 'partups_description_changed';
  let updateTypeData = {
    old_description: value.old,
    new_description: value.new,
  };

  let update = Partup.factories.updatesFactory.make(
    userId,
    partup._id,
    updateType,
    updateTypeData
  );

  Updates.insert(update);
});

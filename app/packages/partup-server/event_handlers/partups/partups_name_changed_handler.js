Event.on('partups.name.changed', function(userId, partup, value) {
  if (!userId) return;

  let updateType = 'partups_name_changed';
  let updateTypeData = {
    old_name: value.old,
    new_name: value.new,
  };

  let update = Partup.factories.updatesFactory.make(
    userId,
    partup._id,
    updateType,
    updateTypeData
  );

  Updates.insert(update);
});

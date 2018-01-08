Event.on('partups.end_date.changed', function(userId, partup, value) {
  if (!userId) return;

  let updateType = 'partups_end_date_changed';
  let updateTypeData = {
    old_end_date: value.old,
    new_end_date: value.new,
  };

  let update = Partup.factories.updatesFactory.make(
    userId,
    partup._id,
    updateType,
    updateTypeData
  );

  Updates.insert(update);
});

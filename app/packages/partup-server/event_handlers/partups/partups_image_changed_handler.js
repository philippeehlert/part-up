Event.on('partups.image.changed', function(userId, partup, value) {
  if (!userId) return;

  let updateType = 'partups_image_changed';
  let updateTypeData = {
    old_image: value.old,
    new_image: value.new,
  };

  let update = Partup.factories.updatesFactory.make(
    userId,
    partup._id,
    updateType,
    updateTypeData
  );

  Updates.insert(update);
});

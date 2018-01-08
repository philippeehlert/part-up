Template.registerHelper('partupImageUrl', function(options) {
  if (!options || !options.hash || !options.hash.id) return '';

  let image = Images.findOne({ _id: options.hash.id });
  if (!image) return;

  let store = options.hash.store || '360x360';
  return Partup.helpers.url.getImageUrl(image, store);
});
Template.registerHelper('partupImageById', function(id) {
  let image = Images.findOne({ _id: id });
  if (!image) return;

  return Partup.helpers.url.getImageUrl(image, '360x360');
});

Template.registerHelper('partupImageObjectUrl', function(options) {
  if (!options || !options.hash || !options.hash.object) return '';

  let store = options.hash.store || '360x360';
  return Partup.helpers.url.getImageUrl(options.hash.object, store);
});

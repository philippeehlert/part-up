Template.ContentBlockView.helpers({
  data: function() {
    let template = Template.instance();
    return {
      block: function() {
        return template.data.block;
      },
      imageUrl: function(imageId) {
        if (!imageId) return false;
        if (imageId) {
          let image = Images.findOne({ _id: imageId });
          if (image) {
            return Partup.helpers.url.getImageUrl(image, '360x360');
          }
        }
      },
    };
  },
});

Template.ContentBlockView.events({
  'click [data-edit]': function(event, template) {
    event.preventDefault();
    template.data.settings.onEdit(template.data.block._id);
  },
  'click [data-up]': function(event, template) {
    event.preventDefault();
    template.data.settings.onUp(template.data.block._id);
  },
  'click [data-down]': function(event, template) {
    event.preventDefault();
    template.data.settings.onDown(template.data.block._id);
  },
});

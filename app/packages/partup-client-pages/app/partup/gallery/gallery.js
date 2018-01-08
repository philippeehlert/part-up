Template.ImageGallery.onCreated(function() {
  let template = this;
});
Template.ImageGallery.helpers({
  popupId: function() {
    return this.updateId + '_gallery';
  },
  singleImage: function() {
    return Template.instance().data.images.length === 1;
  },
});

Template.ImageGallery.events({
  'click [data-open-gallery]': function(event, template) {
    let popupId = $(event.currentTarget).data('open-gallery');
    let imageId = $(event.target)
      .closest('[data-image]')
      .data('image');
    Partup.client.popup.open({
      id: popupId,
      type: 'gallery',
      imageIndex: this.images.indexOf(imageId),
      totalImages: this.images.length,
    });
  },
});

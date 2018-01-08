Template.filePicker.onCreated(function() {
  this.controller = this.data.controller;
  this.expanded = new ReactiveVar(false, (oldVal, newVal) => {
    const $expandButton = $(this.find('[data-expand-picker]'));

    if ($expandButton) {
      const $chevron = $expandButton.find('i');
      if (newVal) {
        $chevron.removeClass('picon-caret-down');
        $chevron.addClass('picon-caret-up');
      } else {
        $chevron.removeClass('picon-caret-up');
        $chevron.addClass('picon-caret-down');
      }
    }
  });
});

Template.filePicker.onRendered(function() {
  this.autorun((computation) => {
    const haveFiles = this.controller.haveFiles.get();
    if (haveFiles) {
      this.expanded.set(true);
      computation.stop();
    }
  });

  Partup.client.html.droppable.apply(this.find('[data-drop-area]'), [
    'drop-area-active',
  ]);
});

Template.filePicker.onDestroyed(function() {
  this.expanded.set(false);
  this.controller.destroy();
});

Template.filePicker.helpers({
  expanded() {
    return Template.instance().expanded.get();
  },
  images() {
    return _.filter(Template.instance().controller.files.get(), (file) =>
      Partup.helpers.files.isImage(file)
    );
  },
  documents() {
    return _.filter(
      Template.instance().controller.files.get(),
      (file) => !Partup.helpers.files.isImage(file)
    );
  },
  getImageUrl(image) {
    return Partup.helpers.url.getImageUrl(image, '360x360');
  },
  getSvgIcon(doc) {
    return Partup.helpers.files.getSvgIcon(doc);
  },
  uploading() {
    return Template.instance().controller.uploading.get();
  },
  imagesRemaining() {
    return Template.instance().controller.imagesRemaining.get();
  },
  documentsRemaining() {
    return Template.instance().controller.documentsRemaining.get();
  },
  haveFiles() {
    return Template.instance().controller.haveFiles.get();
  },
});

Template.filePicker.events({
  'click [data-expand-picker]'(event, templateInstance) {
    if (!templateInstance.controller.limitReached.get()) {
      templateInstance.expanded.set(!templateInstance.expanded.get());
    }
  },
  'click [data-remove-upload]'(event, templateInstance) {
    const fileId = $(event.target).data('remove-upload');
    if (fileId) {
      templateInstance.controller.removeFilesFromCache(fileId);
    } else {
      Partup.client.notify.error(TAPi18n.__('upload-error-1'));
    }
  },
});

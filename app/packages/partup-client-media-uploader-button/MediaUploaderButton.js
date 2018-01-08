import { Template } from 'meteor/templating';
import { FileUploader } from 'meteor/partup-lib';

function photoLimitReached() {
  let mediaUploader = Template.instance().data.mediaUploader;

  return mediaUploader.uploadedPhotos.get().length === mediaUploader.maxPhotos;
}

function mediaLimitReached() {
  let mediaUploader = Template.instance().data.mediaUploader;

  let mediaItems =
    mediaUploader.uploadedPhotos.get().length +
    mediaUploader.uploadedDocuments.get().length;

  return mediaItems === mediaUploader.maxMediaItems;
}

function toggleMenu($toggleContainer) {
  let $button = $toggleContainer.find('.pu-sub-container button');
  let $ul = $toggleContainer.find('ul.pu-dropdown');
  let $icon = $button.find('i');

  let openMenu = function() {
    $toggleContainer.addClass('pu-formdropdown-active');
    $ul.addClass('pu-dropdown-active');
    $icon.removeClass('picon-caret-down');
    $icon.addClass('picon-caret-up');
  };

  let closeMenu = function() {
    $toggleContainer.removeClass('pu-formdropdown-active');
    $ul.removeClass('pu-dropdown-active');
    $icon.addClass('picon-caret-down');
    $icon.removeClass('picon-caret-up');
  };

  if ($icon.hasClass('picon-caret-down')) {
    openMenu();
    $(document).one('click', closeMenu);
  } else {
    closeMenu();
  }
}

Template.MediaUploaderButton.events({
  'click [data-toggle-add-media-menu]': function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    if (!mediaLimitReached()) {
      toggleMenu($(event.currentTarget));
    }
  },
});

Template.MediaUploaderButton.helpers({
  mediaLimitReached: mediaLimitReached,
  fileExtensions: function(allowAllFiles) {
    if (allowAllFiles) return FileUploader.allowedExtensions.all.join(', ');
    return FileUploader.imageExtensions.join(', ');
  },
  uploadingMedia: function() {
    let mediaUploader = Template.instance().data.mediaUploader;

    let uploading = [
      mediaUploader.uploadingPhotos.get(),
      mediaUploader.uploadingDocuments.get(),
    ];

    uploading = _.countBy(uploading, function(value) {
      return value ? 'isActive' : 'notActive';
    });

    return uploading.isActive > 0;
  },
  photoLimitReached: photoLimitReached,
  documentLimitReached: function() {
    let mediaUploader = Template.instance().data.mediaUploader;

    return (
      mediaUploader.uploadedDocuments.get().length ===
      mediaUploader.maxDocuments
    );
  },
  disabledImageUploadFile: function() {
    return photoLimitReached() ? 'disabled' : '';
  },
  mediaUploader: function() {
    return Template.instance().data.mediaUploader;
  },
  imageInput: function() {
    let mediaUploader = Template.instance().data.mediaUploader;

    let token = Accounts._storedLoginToken();
    let location = window.location.origin
      ? window.location.origin
      : window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');

    let imageCount = mediaUploader.uploadedPhotos.get().length;
    let fileCount = mediaUploader.uploadedDocuments.get().length;

    function processImage(fileId) {
      Meteor.subscribe('images.one', fileId);
      Meteor.autorun(function(computation) {
        let file = Images.findOne({ _id: fileId });
        if (file) {
          computation.stop();
          mediaUploader.uploadingPhotos.set(false);

          let uploaded = mediaUploader.uploadedPhotos.get();
          uploaded.push(file._id);
          mediaUploader.uploadedPhotos.set(uploaded);
        }
      });
    }
    function processFile(fileId) {
      Meteor.subscribe('files.one', fileId);
      Meteor.autorun(function(computation) {
        let file = Files.findOne({ _id: fileId });
        if (file) {
          computation.stop();
          mediaUploader.uploadingDocuments.set(false);

          let uploaded = mediaUploader.uploadedDocuments.get();
          uploaded.push({
            _id: file._id,
            name: file.name,
            bytes: file.bytes,
            isPartupFile: true,
          });
          mediaUploader.uploadedDocuments.set(uploaded);
        }
      });
    }

    return {
      button: 'data-browse-photos',
      input: 'data-photo-input',
      multiple: true,
      onFileChange: function(event) {
        mediaUploader.uploadingPhotos.set(true);

        // simulate click event to toggle "open/close" the media choose dropdown
        $('[data-toggle-add-media-menu]').trigger('click');

        let totalPhotos = Math.max(
          mediaUploader.totalPhotos.get(),
          mediaUploader.uploadedPhotos.get().length
        );

        Partup.client.uploader.eachFile(event, (file, index, type) => {
          if (type === 'image') {
            if (totalPhotos === mediaUploader.maxPhotos) return;
            totalPhotos++;
            mediaUploader.totalPhotos.set(totalPhotos);
          } else if (type === 'file') {
            if (
              mediaUploader.uploadedDocuments.get().length ===
              mediaUploader.maxDocuments
            ) {
              return;
            }
          }
          Partup.client.uploader.upload(file, (error, { _id, name }) => {
            mediaUploader.uploadingPhotos.set(false);
            if (error) {
              Partup.client.notify.error(TAPi18n.__(error.reason));
              return;
            }
            if (type === 'image') {
              const uploaded = mediaUploader.uploadedPhotos.get();
              uploaded.push(_id);
              mediaUploader.uploadedPhotos.set(uploaded);
            } else if (type === 'file') {
              const uploaded = mediaUploader.uploadedDocuments.get();
              uploaded.push({
                _id,
                name,
                bytes: file.size,
                isPartupFile: true,
              });
              mediaUploader.uploadedDocuments.set(uploaded);
            }
          });
        });
      },
      onFilesAdded: function(up, files) {
        $('[data-toggle-add-media-menu]').trigger('click');

        imageCount = mediaUploader.uploadedPhotos.get().length;
        fileCount = mediaUploader.uploadedDocuments.get().length;

        plupload.each(files, (file) => {
          let fileType = Partup.helpers.fileUploader.getFileType(file);

          switch (fileType) {
            case 'image':
              if (imageCount >= mediaUploader.maxPhotos) {
                Partup.client.notify.info(
                  `Maximum number of images reached, ${file.name} is removed`
                );
                up.removeFile(file);
              } else {
                imageCount++;
              }
              break;
            case 'file':
              if (fileCount >= mediaUploader.maxDocuments) {
                Partup.client.notify.info(
                  `Maximum number of documents reached, ${file.name} is removed`
                );
                up.removeFile(file);
              } else {
                fileCount++;
              }
              break;
            default:
              break;
          }
        });
        up.start();
      },
      onUploadFile: function(up, file) {
        let fileType = Partup.helpers.fileUploader.getFileType(file);
        fileType === 'image'
          ? mediaUploader.uploadingPhotos.set(true)
          : mediaUploader.uploadingDocuments.set(true);
        up.setOption({
          url: `${location}/${fileType}s/upload?token=${token}`,
        });
      },
      onFileUploaded: function(up, file, result) {
        let fileType = Partup.helpers.fileUploader.getFileType(file);
        let response = JSON.parse(result.response);

        if (response.error) {
          return Partup.client.notify.error(response.error);
        }

        switch (fileType) {
          case 'image':
            processImage(response.image);
            break;
          case 'file':
            processFile(response.file);
            break;
          default:
            Partup.client.notify.error(
              'Could not process file, unknown file type'
            );
            break;
        }
      },
    };
  },
});

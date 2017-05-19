import {Template} from 'meteor/templating';
import {FileUploader} from 'meteor/partup-lib';

function photoLimitReached() {

    let mediaUploader = Template.instance().data.mediaUploader;

    return mediaUploader.uploadedPhotos.get().length
        === mediaUploader.maxPhotos;
}

function mediaLimitReached() {

    let mediaUploader = Template.instance().data.mediaUploader;

    var mediaItems = mediaUploader.uploadedPhotos.get().length +
        mediaUploader.uploadedDocuments.get().length;

    return mediaItems === mediaUploader.maxMediaItems;
}

function toggleMenu($toggleContainer) {
    var $button = $toggleContainer.find('.pu-sub-container button');
    var $ul = $toggleContainer.find('ul.pu-dropdown');
    var $icon = $button.find('i');

    var openMenu = function () {
        $toggleContainer.addClass('pu-formdropdown-active');
        $ul.addClass('pu-dropdown-active');
        $icon.removeClass('picon-caret-down');
        $icon.addClass('picon-caret-up');
    };

    var closeMenu = function () {
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

Template.MediaUploaderButton.onRendered(function() {

        var mediaUploader = Template.instance().data.mediaUploader
        var token = Accounts._storedLoginToken();
        var location = window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        var url = location + '/files/upload?token=' + token;

            var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: 'pickfiles',
            container: document.getElementById('container'),
            url: url,
            flash_swf_url: '../public/files/flash/Moxie.swf',
            silverlight_xap_url: '../public/files/silverlight/Moxie.xap',

            filters: {
                max_file_size: '5mb',
                mime_types: [
                    {title: 'Custom', extensions: Partup.helpers.fileUploader.allowedExtensions.ie.join(',')}
                ]
            },

            init: {
                PostInit: function() {
                    document.getElementById('uploadfiles').onclick = function() {
                        uploader.start();
                        return false;
                    };
                },
                FilesAdded: function (up, files) {
                    plupload.each(files, function(file) {
                        uploader.start()
                    });
                },
                FileUploaded: function (up, file) {
                    const uploaded = mediaUploader.uploadedDocuments.get()
                    uploaded.push({
                        _id: file.id,
                        name: file.name,
                        bytes: file.size,
                        isPartupFile: true,
                    })
                    mediaUploader.uploadedDocuments.set(uploaded)
                }
            }

        })

        uploader.init()
})

Template.MediaUploaderButton.events({
    'click [data-toggle-add-media-menu]': function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        if (!mediaLimitReached()) {
            toggleMenu($(event.currentTarget));
        }
    }
});

Template.MediaUploaderButton.helpers({
    mediaLimitReached: mediaLimitReached,
    fileExtensions: function(allowAllFiles) {
        if (allowAllFiles) return FileUploader.allowedExtensions.all.join(', ');
        return FileUploader.imageExtensions.join(', ');
    },
    uploadingMedia: function () {
        let mediaUploader = Template.instance().data.mediaUploader;

        var uploading = [
            mediaUploader.uploadingPhotos.get(),
            mediaUploader.uploadingDocuments.get()
        ];

        uploading = _.countBy(uploading, function (value) {
            return (value) ? 'isActive' : 'notActive';
        });

        return uploading.isActive > 0;
    },
    photoLimitReached: photoLimitReached,
    documentLimitReached: function () {
        let mediaUploader = Template.instance().data.mediaUploader;

        return mediaUploader.uploadedDocuments.get().length
            === mediaUploader.maxDocuments;
    },
    disabledImageUploadFile: function () {
        return (photoLimitReached()) ? 'disabled' : '';
    },
    mediaUploader: function() {
        return Template.instance().data.mediaUploader;
    },
    imageInput: function () {
        let mediaUploader = Template.instance().data.mediaUploader;

        return {
            button: 'data-browse-photos',
            input: 'data-photo-input',
            multiple: true,
            onFileChange: function (event) {

                mediaUploader.uploadingPhotos.set(true);

                // simulate click event to toggle "open/close" the media choose dropdown
                $('[data-toggle-add-media-menu]').trigger('click');

                let totalPhotos = Math.max(mediaUploader.totalPhotos.get(), mediaUploader.uploadedPhotos.get().length);
                Partup.client.uploader.eachFile(event, (file, index, type) => {
                    if (type === 'image') {
                        if (totalPhotos === mediaUploader.maxPhotos) return;
                        totalPhotos++;
                        mediaUploader.totalPhotos.set(totalPhotos);
                    } else if (type === 'file') {
                        if (mediaUploader.uploadedDocuments.get().length === mediaUploader.maxDocuments) return;
                    }
                    Partup.client.uploader.upload(file, (error, {_id, name}) => {
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
            }
        };
    }
});

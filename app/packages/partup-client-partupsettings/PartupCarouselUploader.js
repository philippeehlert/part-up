const placeholders = {
    'video_url': function() {
        return TAPi18n.__('pages-app-profile-video_url-placeholder');
    },
};

const maxItems = 4;

Template.PartupCarouselUploader.onCreated(function() {
    const template = this;
    template.addingVideoUrl = new ReactiveVar(false);
    template.uploadingPhoto = new ReactiveVar(false);
    if (template.data.currentPartup && template.data.currentPartup.highlighted) {
        template.items = new ReactiveVar([...template.data.currentPartup.highlighted]);
    } else {
        template.items = new ReactiveVar([]);
    }
});

Template.PartupCarouselUploader.helpers({
    placeholders: placeholders,
    typeIsVideo: (type) => type === 'video',
    addingVideoUrl: () => Template.instance().addingVideoUrl.get(),
    uploadingPhoto: () => Template.instance().uploadingPhoto.get(),
    reachedMaxItems: () => Template.instance().items.get().length === maxItems,
    items: () => Template.instance().items.get(),
    itemsAreEmpty: () => !Template.instance().items.get().length,
    getItemIndex: (index, field) => `highlighted.${index}.${field}`,
    imageInput: () => {
        const template = Template.instance();

        return {
            button: 'data-image-browse',
            input: 'data-image-input',
            onFileChange: (event) => {
                const currentItems = template.items.get();
                if (currentItems.length >= maxItems) {
                    Partup.client.notify.error('Cannot add more than 4 photos or videos, please remove one first.');
                    return;
                }

                Partup.client.uploader.eachFile(event, function(file, index, type) {
                    if (type !== 'image') {
                        Partup.client.notify.error('Please upload only images.');
                        template.uploadingPhoto.set(false);
                        return;
                    }

                    template.uploadingPhoto.set(true);
                    Partup.client.uploader.uploadImage(file, function(error, image) {
                        if (error) {
                            Partup.client.notify.error(TAPi18n.__('profilesettings-form-image-error'));
                            template.uploadingPhoto.set(false);
                            return;
                        }

                        template.items.set([
                            ...template.items.get(),
                            {
                                type: 'image',
                                id: image._id,
                            },
                        ]);

                        template.uploadingPhoto.set(false);
                    });
                });
            }
        }
    }
})

Template.PartupCarouselUploader.events({
    'click [data-remove-image]': (event, template) => {
        const imageId = event.target.getAttribute('data-remove-image');

        template.items.set([
            ...template.items.get().filter(({id}) => !(id && id === imageId)),
        ]);
    },
    'click [data-remove-video]': (event, template) => {
        const urlToRemove = event.target.getAttribute('data-remove-video');

        template.items.set([
            ...template.items.get().filter(({url}) => !(url && url === urlToRemove)),
        ]);
    },
    'click [data-add-video]': (event, template) => {
        event.preventDefault();
        Template.instance().addingVideoUrl.set(true);
    },
    'click [data-add-video-url]': (event, template) => {
        event.preventDefault();

        const value = template.$('[name="video_url"]').val();

        if (!value) {
            return;
        }

        const currentItems = template.items.get();
        if (currentItems.length >= maxItems) {
            Partup.client.notify.error('Cannot add more than 4 photos or videos, please remove one first.');
            return;
        }

        const validYoutubeUrlRegex = /http(s)?:\/\/(www\.)?youtube\./i;
        const validVimeoUrlRegex = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/i;

        const isYoutube = value.match(validYoutubeUrlRegex);
        const isVimeo = value.match(validVimeoUrlRegex);

        if (!isYoutube && !isVimeo) {
            Partup.client.notify.error('Video url needs to be a valid youtube video url.');
            return;
        }

        let videoId;
        if (isYoutube) {
            videoId = mout.queryString.getParam(value, 'v');
        } else if (isVimeo) {
            videoId = isVimeo[4];
        }

        if (currentItems.find(({ currentVideoId }) => currentVideoId && currentVideoId === videoId)) {
            Partup.client.notify.error('Video has already been added.');
            return;
        }

        const videoObject = {
            type: 'video',
            videoType: isYoutube ? 'youtube' : 'vimeo',
            videoId: videoId,
            thumb: isYoutube ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : `https://i.vimeocdn.com/video/${videoId}_640.jpg`,
            url: value,
        };

        template.items.set([
            ...template.items.get(),
            videoObject,
        ]);

        template.$('[name="video_url"]').val('');
        template.addingVideoUrl.set(false);
    },
    'click [data-close-video-url]': function(event, template) {
        event.preventDefault();
        Template.instance().addingVideoUrl.set(false);
    },
});

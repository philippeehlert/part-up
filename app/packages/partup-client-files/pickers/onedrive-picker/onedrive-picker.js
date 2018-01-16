import _ from 'lodash';

const onedrivePickerConfig = {
    clientId: 'a8ab6cd2-327e-4325-ba30-198c4d620278',
    action: 'share',
    multiSelect: true,
    advanced: {
        redirectUri: `${window.location.origin}/drivePicker`,
        // filter: '' // for some reason the picker does not work when filters are applied
    },
};

const onlyAllowedFiles = (file) => {
    const ext = Partup.helpers.files.getExtension(file);
    return _.includes(Partup.helpers.files.extensions.all, ext);
};

const successCallback = (controller) => async (data) => {
    const transformedFiles = [];
    _.each(data.value, (file) => {
        const transformed = Partup.helpers.files.transform.onedrive(file);
        if (!transformed) {
            Partup.client.notify.info(TAPi18n.__(`upload-error-no_shareable_link`, file.name));
        } else {
            transformedFiles.push(transformed);
        }
    });

    const files = _.filter(controller.canAdd(transformedFiles, (removedFile) => {
        const category = Partup.helpers.files.isImage(removedFile)
            ? 'images'
            : 'files';

        Partup.client.nofity.info(
            TAPi18n.__('upload-info-limit-reached', {
                category,
                filename: removedFile.name,
            })
        );
    }), onlyAllowedFiles);

    controller.uploading.set(true);
    const uploadPromises = [];
    _.each(files, (file) => {
        const uploadPromise = controller
            .insertFileToCollection(file)
            .then((inserted) => controller.addFilesToCache(inserted))
            .catch((error) =>
                Partup.client.notify.error(
                    TAPi18n.__(`upload-error-${error.code}`)
                )
            );

        uploadPromises.push(uploadPromise);
    });

    Promise.all(uploadPromises)
        .catch((error) =>
            Partup.client.notify.error(TAPi18n.__(`upload-error-100`))
        )
        .finally(() => controller.uploading.set(false));
};

const errorCallback = async (error) => Partup.client.notify.error(TAPi18n.__('upload-error-100'));

const open = (controller) => () => {
    OneDrive.open({
        ...onedrivePickerConfig,
        success: successCallback(controller),
        error: errorCallback,
        // cancel: '',
    });
};

Template.onedrivePicker.onRendered(function() {
    this.controller = this.data.controller;
    if (!this.controller) {
        throw new Error(
            'onedrivePicker: cannot operate without a FileController'
        );
    }

    this.$trigger = $('[data-browse-onedrive');
    if (!this.$trigger) {
        throw new Error(
            'onedrivePicker: expected to find an html element with the "data-browse-onedrive" attribute'
        );
    }

    this.$trigger.on('click', open(this.controller));
});

Template.onedrivePicker.onDestroyed(function() {
    this.$trigger.off('click', open);
});

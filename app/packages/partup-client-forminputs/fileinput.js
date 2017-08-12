Template.FileInput.onRendered(function () {
    const template = this
    const settings = this.data.inputSettings
    const pluploadSettings = this.data.pluploadSettings;

    // For some reason, this template get's rendered twice on the PartupSettings modal
    // to prevent the pluploader from initializing twice the settings will only get passed when the Partupsettings template is rendered.
    if (pluploadSettings) {
        pluploadSettings.config.browse_button = template.find(pluploadSettings.buttons.browse);
        this.uploader = new Pluploader(pluploadSettings);
    } else if (settings) {
        var button = template.find('[' + template.data.inputSettings.button + ']');
        var input = template.find('[' + template.data.inputSettings.input + ']');
        var multiple = template.data.inputSettings.multiple;

        Partup.client.uploader.create({
            buttonElement: button,
            fileInput: input,
            multiple: multiple,
            onFileChange: function(fileInputEvent) {
                template.data.inputSettings.onFileChange(fileInputEvent);
            },
            onFilesAdded: settings.onFilesAdded,
            onUploadFile: settings.onUploadFile,
            onFileUploaded: settings.onFileUploaded
        });
    }
});

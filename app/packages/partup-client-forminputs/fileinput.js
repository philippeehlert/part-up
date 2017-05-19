// import { FileUploader } from ''

/**
 * The FileInput template provides an interface to parent template for handling files.
 * 
 */

Template.FileInput.onRendered(function () {
    const template = this
    const settings = this.data.inputSettings

    var button = template.find('[' + template.data.inputSettings.button + ']');
    var input = template.find('[' + template.data.inputSettings.input + ']');
    var multiple = template.data.inputSettings.multiple;

    Partup.client.uploader.create({
        buttonElement: button,
        fileInput: input,
        multiple: multiple,
        onFileChange: function(fileInputEvent) {
            template.data.inputSettings.onFileChange(fileInputEvent);
        }
    });
});


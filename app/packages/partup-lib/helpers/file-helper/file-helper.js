import Enum from 'enum';

const extensions = {
    
    types: new Enum([
        'image',
        'document',
        'presentation',
        'spreadsheet',
        'file',
    ], 'types'),

    image: new Enum([
        'bmp',
        'gif',
        'jpg',
        'jpeg',
        'png',
        'svg',
    ], extensions.types.image),

    document: new Enum([
        'doc',
        'docx',
        'rtf',
        'pages',
        'txt',
        'pdf',
    ], extensions.types.document),

    presentation: new Enum([
        'pps',
        'ppsx',
        'ppt',
        'pptx',
    ], extensions.types.presentation),

    spreadsheet: new Enum([
        'xls',
        'xlsx',
        'numbers',
        'csv',
    ], extensions.types.spreadsheet),
    
    file: new Enum([
        'ai',
        'psd',
        'eps',
        'tif',
        'tiff',
        'key',
        'keynote',
    ], extensions.types.file),
    
    get allExtensions() {
        return [].concat(
            this[this.types.image].values,
            this[this.types.document].values,
            this[this.types.presentation].values,
            this[this.types.spreadsheet].values,
            this[this.types.file].values,
        );
    },

    getFileType(blob) {
        if (!blob || !blob.type) {
            return undefined;
        }

        const seperatorIndex = blob.type.indexOf('/');
        return seperatorIndex > 1 ?
            this[blob.type.substr(0, seperatorIndex)].key :
            undefined;
    },

    getFileExtension(blob) {

    }
}

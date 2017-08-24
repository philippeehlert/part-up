import _ from 'lodash';
import _filemap from './_filemap';
import FileInfo from './_fileinfo';

// when testing, Partup may not be initialized.
if (!Partup) {
    Partup = {
        helpers: {
            files: {},
        },
    }
}

/**
 * Partup file helper
 * 
 * @description Provides helpers for the client and server to validate files.
 */
Partup.helpers.files = {

    // #region properties

    /**
     * Acts as an enum for categories where key === value
     */
    categories: {},

    /**
     * Map of categories to extensions
     */
    extensions: {},

    /**
     * Map of extensions to FileInfo objects
     */
    info: {},

    /**
     * Map of signatures to extensions
     */
    signatures: {},


    /**
     * Get the extension of a file based on the name or mime
     * 
     * @param {File} file 
     * @returns {String}
     */
    getExtension(file) {
        const { name, type } = file;
        let typeExt;
        let nameExt;

        if (type) {
            typeExt = _.toLower(type.substr((type.indexOf('/') + 1), type.length));
        }
        if (name) {
            nameExt = _.toLower(name.substr((name.lastIndexOf('.') + 1), name.length));
        }
        return typeExt || nameExt;
    },

    /**
     * Client side check if the file is an image based on the name or mime.
     * 
     * @param {File} file as long as a name or type property is present
     * @returns {Boolean}
     */
    isImage(file) {
        return _.includes(this.extensions['image'], this.getExtension(file)) ? true : false;
    },

    /**
     * Get the related SVG icon for a file, does not work for image files.
     * 
     * @param {File} file
     * @returns {String} 'file.svg'
     */
    getSvgIcon(file) {
        const ext = this.getExtension(file);
        const { icon } = this.info[ext];
        return icon;
    },

    /**
     * Transform a file category to a Plupload mime filter,
     * pass in extensions to create custom filters.
     * 
     * @param {String} category
     * @param {[String]} extensions [OPTIONAL]
     * @returns plupload mime filter
     */
    toUploadFilter(category, extensions = undefined) {
        return {
            name: category,
            extensions: extensions || this.extensions[category].join(','),
        };
    },
};


// Create properties based on the _fileMap.
_.each(_filemap, ({ category, icon, data }) => {
    const typeExts = [];

    _.each(data, fileInfo => {
        const { extension, mime, signatures } = fileInfo;

        typeExts.push(extension);

        Partup.helpers.files.info[extension] = new FileInfo(
            category,
            extension,
            mime,
            signatures,
            (fileInfo.icon || icon));

        _.each(signatures, ({ bytes }) => {
            
            if (!Partup.helpers.files.signatures[bytes]) {
                Partup.helpers.files.signatures[bytes] = [];
            }

            Partup.helpers.files.signatures[bytes].push(extension);
        });
    });

    Partup.helpers.files.categories[category] = category;
    Partup.helpers.files.extensions[category] = typeExts;
});

/**
 * Expose an array of all extensions
 */
Partup.helpers.files.extensions.all = _.reduce(Object.keys(Partup.helpers.files.extensions), (result, key) => {
    return _.concat(result, Partup.helpers.files.extensions[key])
}, []);


// Freeze the props to prevent any modification, e.g. file.extensions[x] = y
Object.freeze(Partup.helpers.files.categories);
Object.freeze(Partup.helpers.files.extensions);
Object.freeze(Partup.helpers.files.info);
Object.freeze(Partup.helpers.files.signatures);

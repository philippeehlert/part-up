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
     * @memberof Partup.helpers.files
     */
    categories: {},

    /**
     * Map of categories to extensions
     * @memberof Partup.helpers.files
     */
    extensions: {},

    /**
     * Map of extensions to FileInfo objects
     * @memberof Partup.helpers.files
     */
    info: {},

    /**
     * Map of signatures to extensions
     * @memberof Partup.helpers.files
     */
    signatures: {},

    /**
     * Maximum file size in bytes (binary, 20mb)
     * @memberof Partup.helpers.files
     */
    max_file_size: 20971520,

    FILE_SERVICES: {
        PARTUP: 'partup',
        DROPBOX: 'dropbox',
        GOOGLEDRIVE: 'googledrive',
        ONEDRIVE: 'onedrive',
    },

    // #endregion

    // #region methods

    /**
     * Get the file info object for a file
     *
     * @param {File} file
     * @returns {FileInfo} object containing info about a file
     */
    getFileInfo(file) {
        const { name, type } = file;
        let ext;

        if (name && name.lastIndexOf('.') !== -1) {
            ext = _.toLower(name.substr((name.lastIndexOf('.') + 1), name.length));
        }

        return ext ? this.info[ext] : this.info[_.toLower(type)];
    },


    /**
     * Get the extension of a file based on the name or mime
     *
     * @param {File} file
     * @returns {String}
     */
    getExtension(file) {
        if (!file) {
            throw new Error('getExtension: file is undefined');
        }

        const info = this.getFileInfo(file);

        if (info) {
            return info[0] ?
                undefined :
            info.extension;
        }
        return undefined;
    },

    getCategory(file) {
        if (!file) {
            throw new Meteor.Error(0, 'extension is undefined');
        }

        const info = this.info[file] || this.getFileInfo(file);

        if (info) {
            return info[0] ?
                info[0].category :
            info.category;
        }
        return undefined;
    },

    /**
     * Client side check if the file is an image based on the name or mime.
     *
     * @param {File} file as long as a name or type property is present
     * @returns {Boolean}
     */
    isImage(file) {
        if (!file) {
            throw new Meteor.Error(0, 'file is undefined');
        }

        const info = this.getFileInfo(file);
        if (info) {
            return info[0] ?
                info[0].category === this.categories.image :
            (_.includes(this.extensions.image, info.extension) || info.category === this.categories.image);
        }
        return false;
    },

    /**
     * Get the related SVG icon for a file, does not work for image files.
     *
     * @param {File} file
     * @returns {String} 'file.svg'
     */
    getSvgIcon(file) {
        if (!file) {
            throw new Meteor.Error(0, 'file is undefined');
        }

        const info = this.getFileInfo(file);
        if (info) {
            return (info[0] instanceof FileInfo) ? info[0].icon : info.icon;
        }
        return 'file.svg';
    },

    /**
     * Transform a file category to a Plupload mime filter,
     * pass in extensions to create custom filters.
     *
     * @param {String} category
     * @param {[String]} extensions optional
     * @returns plupload mime filter
     */
    toUploadFilter(category, extensions = undefined) {
        return {
            title: category,
            extensions: (Array.isArray(extensions) ? extensions.join(',') : extensions) || this.extensions[category].join(','),
        };
    },

    /**
     * Convert a shorthand string size to binary size, e.g. 5mb
     *
     * @param {String} size e.g. '5mb'
     * @returns {Number} binary value of size
     */
    shortToBinarySize(size) {
        if (!(typeof size === 'string')) {
            throw new Meteor.Error(0, `expected size to be of type string but is ${typeof size}`);
        }

        const match = size.match(/([0-9]+)([bkmgt])/i)
        if (match[1]) {
            switch (match[2]) {
                case 'b':
                    return match[1] * 1;
                case 'k':
                    return match[1] * 1024;
                case 'm':
                    return match[1] * 1024 * 1024;
                case 'g':
                    return match[1] * 1024 * 1024 * 1024;
                case 't':
                    return match[1] * 1024 * 1024 * 1024 * 1024;
                default:
                    break;
            }
        }

        return 0;
    },

    binaryToShortSize(size) {
        if (!(typeof size === 'number')) {
            throw new Error(`binaryToShortSize: size is not a number ${size}`);
        } else if (size === 0) {
            return size;
        }

        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const index = parseInt(Math.floor(Math.log(size) / Math.log(1024)), 10);

        if (index === 0) {
            return `${size} ${sizes[index]}`;
        }

        return `${(size / Math.pow(1024, index)).toFixed(1)} ${sizes[index]}`;
    },

    // #endregion
};

// Create properties based on _fileMap which is the single source of truth
_.each(_filemap, ({ category, icon, data }) => {
    const typeExts = [];

    _.each(data, fileInfo => {
        const { extension, mime, signatures } = fileInfo;

        typeExts.push(extension);

        const info = new FileInfo(
            category,
            extension,
            mime,
            signatures,
            (fileInfo.icon || icon)
        );

        Partup.helpers.files.info[extension] = info;

        Partup.helpers.files.info[mime] ?
            Partup.helpers.files.info[mime] = _.concat(Partup.helpers.files.info[mime], [info]) :
            Partup.helpers.files.info[mime] = info;

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
    return _.concat(result, Partup.helpers.files.extensions[key]);
}, []);

/**
 * Expose an array of all categories
 * */
Partup.helpers.files.categories.all = _.reduce(Object.keys(Partup.helpers.files.categories), (result, key) => {
    return _.concat(result, Partup.helpers.files.categories[key]);
});

if (Meteor.isClient) {
    Partup.helpers.files.transform = {
        dropbox(dropboxFile) {
            const file = {
                name: dropboxFile.name,
                type: Partup.helpers.files.info[Partup.helpers.files.getExtension(dropboxFile)].mime,
                bytes: dropboxFile.bytes,
                service: Partup.helpers.files.FILE_SERVICES.DROPBOX,
            };

            file.link = Partup.helpers.files.isImage(file) ?
                `${dropboxFile.link.slice(0, -1)}1` :
            dropboxFile.link;

            return file;
        },
        googledrive(driveFile) {
            const file = {
                name: driveFile.name,
                type: driveFile.mimeType,
                bytes: (!isNaN(driveFile.sizeBytes) ? parseInt(driveFile.sizeBytes) : 0),
                service: Partup.helpers.files.FILE_SERVICES.GOOGLEDRIVE,
            };

            file.link = Partup.helpers.files.isImage(file) ?
                `https://docs.google.com/uc?id=${driveFile.id}` :
            driveFile.url.toString();

            return file;
        },
        onedrive(onedriveFile) {
            const file = {
                name: onedriveFile.name,
                type: onedriveFile.file.mimeType,
                bytes: (!isNaN(onedriveFile.size) ? parseInt(onedriveFile.size) : 0),
                service: Partup.helpers.files.FILE_SERVICES.ONEDRIVE,
            };

            file.link = Partup.helpers.files.isImage(file)
                ? _.get(onedriveFile, '@microsoft.graph.downloadUrl', null)
                : _.get(onedriveFile.permissions[0], 'link.webUrl', null);

            return file.link ? file : null;
        },
    };
}

// Freeze the props to prevent any modification, e.g. file.extensions[x] = y
Object.freeze(Partup.helpers.files.categories);
Object.freeze(Partup.helpers.files.extensions);
Object.freeze(Partup.helpers.files.info);
Object.freeze(Partup.helpers.files.signatures);

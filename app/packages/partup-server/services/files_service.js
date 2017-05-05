var path = Npm.require('path');

/**
 @namespace Partup server files service
 @name Partup.server.services.files
 @memberof Partup.server.services
 */
Partup.server.services.files = {
    /**
     * Upload a file
     *
     * @param {String} filename
     * @param {String} body
     * @param {String} mimetype
     * @param {Object} options
     * @param {String} options._id
     * @param {Object} options.meta
     */
    upload: function(filename, body, mimetype, options) {
        var s3 = new AWS.S3({params: {Bucket: process.env.AWS_BUCKET_NAME}});
        options = options || {};
        var meta = options.meta || {};
        var id = options.id || Random.id();

        var extension = path.extname(filename);
        var basename = path.basename(filename, extension);

        filename = basename.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '.') + '-' + id + extension;

        var file = {
            _id: id,
            name: filename,
            type: mimetype,
            createdAt: new Date(),
            meta: meta
        };

        s3.putObjectSync({Key: 'files/' + filename, Body: body, ContentType: mimetype});

        Files.insert(file);

        return file;
    },

    /**
     * Remove a file
     *
     * @param {String} id
     */
    remove: function(id) {
        var s3 = new AWS.S3({params: {Bucket: process.env.AWS_BUCKET_NAME}});
        var file = Files.findOne({_id: id});
        if (!file) return;

        // Remove from S3
        s3.deleteObjectSync({Key: 'files/' + file.name});

        // Remove from DB
        Files.remove(id);
    }
};

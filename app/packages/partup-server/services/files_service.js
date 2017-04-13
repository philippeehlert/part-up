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

        var file = {
            _id: id,
            name: filename,
            type: mimetype,
            createdAt: new Date(),
            meta: meta
        };

        var filekey = id + '-' + filename;
        s3.putObjectSync({Key: 'files/' + filekey, Body: body, ContentType: mimetype});

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
        var filekey = file._id + '-' + file.name;
        s3.deleteObjectSync({Key: 'files/' + filekey});

        // Remove from DB
        Files.remove(id);
    }
};

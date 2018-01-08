let gm = Npm.require('gm').subClass({ imageMagick: true });
let path = Npm.require('path');
import _ from 'lodash';

/**
 @namespace Partup server images service
 @name Partup.server.services.images
 @memberof Partup.server.services
 */
Partup.server.services.images = {
  /**
   * Upload (and resize) an image
   *
   * @param {String} filename
   * @param {String} body
   * @param {String} mimetype
   * @param {Object} options
   * @param {String} options._id
   * @param {Object} options.meta
   */
  upload: function(filename, body, mimetype, options) {
    let s3 = new AWS.S3({
      params: { Bucket: process.env.AWS_BUCKET_NAME },
    });

    var options = options || {};
    let meta = options.meta || {};
    let id = options.id || Random.id();

    let extension = path.extname(filename);
    var filename = id + extension;

    let image = {
      _id: id,
      name: filename,
      type: mimetype,
      copies: {},
      createdAt: new Date(),
      meta: meta,
    };

    let filekey = id + '-' + filename;

    // TODO (extra): Add .autoOrient() to gm calls

    s3.putObjectSync({
      Key: 'images/' + filekey,
      Body: body,
      ContentType: mimetype,
    });
    image.copies['original'] = {
      key: 'images/' + filekey,
      size: body.length,
    };

    let sizes = [
      { w: 32, h: 32 },
      { w: 80, h: 80 },
      { w: 360, h: 360 },
      { w: 1200, h: 520 },
    ];

    let resize = function(filename, body, width, height, callback) {
      gm(body, filename)
        .resize(width, height)
        .toBuffer(function(error, resizedBody) {
          if (error) return callback(error);
          return callback(null, resizedBody);
        });
    };

    let resizeSync = Meteor.wrapAsync(resize);

    sizes.forEach(function(size) {
      let directory = size.w + 'x' + size.h;
      let resizedBody = resizeSync(filename, body, size.w, size.h);
      image.copies[directory] = {
        key: 'images/' + filekey,
        size: resizedBody.length,
      };
      s3.putObjectSync({
        Key: directory + '/images/' + filekey,
        Body: resizedBody,
        ContentType: mimetype,
      });
    });

    Images.insert(image);

    return image;
  },

  remove(id) {
    const s3 = new AWS.S3({
      params: { Bucket: process.env.AWS_BUCKET_NAME },
    });
    const image = Images.findOne(id);

    if (image && image.copies) {
      const s3Key = `${image._id}-${image.name}`;
      _.each(Object.keys(image.copies), (key) => {
        if (key === 'original') {
          s3.deleteObjectSync({ Key: `images/${s3Key}` });
        } else {
          s3.deleteObjectSync({ Key: `${key}/images/${s3Key}` });
        }
      });

      return {
        _id: id,
      };
    }
    throw new Meteor.Error(
      0,
      `images:remove could not find image with _id: ${id} or the image has no copies: ${
        image.copies
      }`
    );
  },

  /**
   * Store a focuspoint in an image
   *
   * @param {string} imageId
   * @param {number} focuspoint_x
   * @param {number} focuspoint_y
   */
  storeFocuspoint: function(imageId, focuspoint_x, focuspoint_y) {
    if (!imageId) {
      throw new Error(
        'Required argument [imageId] is missing for method [Partup.server.services.images::storeFocuspoint]'
      );
    }
    if (!mout.lang.isNumber(focuspoint_x)) {
      throw new Error(
        'Required argument [focuspoint_x] is not a number for method [Partup.server.services.images::storeFocuspoint]'
      );
    }
    if (!mout.lang.isNumber(focuspoint_y)) {
      throw new Error(
        'Required argument [focuspoint_y] is not a number for method [Partup.server.services.images::storeFocuspoint]'
      );
    }
    if (focuspoint_x < 0 || focuspoint_x > 1) {
      throw new Error(
        'Argument [focuspoint_x] is not a number between 0 and 1 for method [Partup.server.services.images::storeFocuspoint]'
      );
    }
    if (focuspoint_y < 0 || focuspoint_y > 1) {
      throw new Error(
        'Argument [focuspoint_y] is not a number between 0 and 1 for method [Partup.server.services.images::storeFocuspoint]'
      );
    }

    let image = Images.findOne(imageId);
    if (!image) {
      throw new Error(
        'Could not find an image by [imageId] for method [Partup.server.services.images::storeFocuspoint]'
      );
    }

    let focuspoint = {
      x: focuspoint_x,
      y: focuspoint_y,
    };

    Images.update(imageId, { $set: { focuspoint: focuspoint } });
  },
};

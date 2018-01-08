/**
 * Insert the default profile pictures into the database
 */
Meteor.startup(function() {
  if (
    !AWS.config.accessKeyId ||
    !AWS.config.secretAccessKey ||
    !AWS.config.region
  ) {
    return console.log(
      'Default partup pictures could not be loaded because the amazon s3 configuration has not been set, please check your environment variables.'
        .red
    );
  }

  for (let i = 1; i <= 12; i++) {
    let exists = !!Images.findOne({
      'meta.default_partup_picture': true,
      'meta.default_partup_picture_index': i,
    });

    if (!exists) {
      let filename = 'Partupfoto' + i + '.png';
      let body = new Buffer(
        Assets.getBinary('private/default_partup_pictures/' + filename)
      );
      let meta = {
        default_partup_picture: true,
        default_partup_picture_index: i,
      };

      Partup.server.services.images.upload(filename, body, 'image/png', {
        meta: meta,
      });
    }
  }
});

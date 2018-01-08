Meteor.startup(function() {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (
      !AWS.config.accessKeyId ||
      !AWS.config.secretAccessKey ||
      !AWS.config.region
    ) {
      return console.log(
        'Image fixtures could not be loaded because the amazon s3 configuration has not been set, please check your environment variables.'
          .red
      );
    }

    let downloadAndSaveImage = function(imageId, url) {
      let result = HTTP.get(url, {
        npmRequestOptions: { encoding: null },
      });
      let body = new Buffer(result.content, 'binary');
      Partup.server.services.images.upload(
        imageId + '.jpg',
        body,
        'image/jpeg',
        {
          id: imageId,
        }
      );
    };

    if (Images.find().count() === 27) {
      // Networks - Lifely (open)
      downloadAndSaveImage(
        'raaNx9aqA6okiqaS4',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/7543891_300x300.jpg'
      );
      downloadAndSaveImage(
        'SEswZsYiTTKTTdnN5',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/icon152.png'
      );

      // Networks - ING (public)
      downloadAndSaveImage(
        'T8pfWebTJmvbBNJ2g',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/ing_logo.jpeg'
      );
      downloadAndSaveImage(
        'f7yzkqh9J9JvxCCqN',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/ing-no-text.jpg'
      );

      // Networks - ING (invite)
      downloadAndSaveImage(
        'efDuvuTzpqH65P9DF',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/ing_logo.jpeg'
      );
      downloadAndSaveImage(
        'fReGXG4qkNXb4K8wp',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/ing-no-text.jpg'
      );

      // Networks - ING (closed)
      downloadAndSaveImage(
        'PnYAg3EX5dKfEnkdn',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/ing_logo.jpeg'
      );
      downloadAndSaveImage(
        '4rymNTA3jFfTRKtFJ',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/ing-no-text.jpg'
      );

      // Users - Default User
      downloadAndSaveImage(
        'oQeqgwkdd44JSBSW5',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/normal_3810.png'
      );

      // Users - John Partup
      downloadAndSaveImage(
        'cHhjpWKo9DHjXQQjy',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/normal_6861.png'
      );

      // Users - Judy Partup
      downloadAndSaveImage(
        'bMTGT9oSDGzxCL3r4',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/normal_253.png'
      );

      // Users - Admin User
      downloadAndSaveImage(
        'CxEprGKNWo6HdrTdq',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/normal_511.png'
      );

      // Partups - Crowd funding Part-up organiseren
      downloadAndSaveImage(
        'FTHbg6wbPxjiA4Y8w',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/Premium.jpg'
      );

      // Partups - Super secret closed ING partup
      downloadAndSaveImage(
        'D3zGxajTjWCLhXokS',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/86-ing.jpg'
      );

      // Partups - A semisecret ING partup, plus ones are ok
      downloadAndSaveImage(
        'ComeF2exAjeKBPAf8',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/ing-wide-logo-wall.jpg'
      );

      // Partups - Organise a Meteor Meetup
      downloadAndSaveImage(
        'J2KxajXMcqiKwrEBu',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/687474703a2f2f636c2e6c792f59366a6e2f76656761732e706e672532303d32303078313032'
      );

      // Partups - Partup Premium Part-up
      downloadAndSaveImage(
        'xfYreAouRFh4mnctk',
        'https://s3-eu-west-1.amazonaws.com/partup-dev-images/Premium.jpg'
      );
    }
  }
});

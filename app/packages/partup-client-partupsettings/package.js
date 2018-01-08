Package.describe({
  name: 'partup-client-partupsettings',
  version: '0.0.1',
  summary: '',
  documentation: null,
});

Package.onUse(function(api) {
  api.use(
    [
      'templating',
      'aldeed:autoform',
      'reactive-var',
      'reactive-dict',
      'ecmascript',
      'partup-client-imagesystem',
    ],
    'client'
  );

  api.addFiles(
    [
      'BoardSwitch.html',
      'BoardSwitch.js',

      'PartupCarouselUploader.html',
      'PartupCarouselUploader.js',

      'Partupsettings.html',
      'Partupsettings.js',
    ],
    'client'
  );
});

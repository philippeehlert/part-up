Package.describe({
  name: 'partup-client-media-uploader-button',
  version: '0.0.1',
  summary: '',
  documentation: null,
});

Package.onUse(function(api) {
  api.use(['ecmascript', 'templating', 'ecmascript'], 'client');

  api.addFiles(
    ['MediaUploaderButton.html', 'MediaUploader.js', 'MediaUploaderButton.js'],
    'client'
  );

  api.export('MediaUploader');
});

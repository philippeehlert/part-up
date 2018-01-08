Package.describe({
  name: 'partup-client-ratings',
  version: '0.0.1',
  summary: '',
  documentation: null,
});

Package.onUse(function(api) {
  api.use(
    ['templating', 'partup-lib', 'reactive-dict', 'ecmascript'],
    'client'
  );

  api.addFiles(['Ratings.html', 'Ratings.js'], 'client');
});

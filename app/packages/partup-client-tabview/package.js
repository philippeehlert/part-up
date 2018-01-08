Package.describe({
  name: 'partup-client-tabview',
  version: '0.0.1',
  summary: '',
  documentation: null,
});

Package.onUse(function(api) {
  api.use(['templating', 'partup-lib', 'reactive-var', 'ecmascript'], 'client');

  api.addFiles(['TabView.html', 'TabView.js'], 'client');
});

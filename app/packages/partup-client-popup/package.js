Package.describe({
  name: 'partup-client-popup',
  version: '0.0.1',
  summary: '',
  documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'aldeed:autoform',
        'ecmascript',
    ], 'client');

    api.addFiles([

        'Popup.html',
        'Popup.js'

    ], 'client');

});

/**
 * Partup imagesystem for profile images
 */
Package.describe({
    name: 'partup-client-imagesystem',
    version: '0.0.1',
    summary: '',
    documentation: null,
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'reactive-var',
        'reactive-dict',
        'ecmascript',
    ], 'client');

    api.addFiles([
        'imagesystem.html',
        'imagesystem.js',
    ], 'client');

});

Package.describe({
    name: 'partup-client-header',
    version: '0.0.1',
    summary: 'Responsive blue app header',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup-lib',
        'reactive-var',
        'ecmascript',
    ], 'client');

    api.addFiles([

        'Header.html',
        'Header.js',

        'templates/logo.html'

    ], 'client');

});

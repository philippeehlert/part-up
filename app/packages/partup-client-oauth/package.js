Package.describe({
    name: 'partup-client-oauth',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup-lib',
        'reactive-var',
        'reactive-dict'
    ], 'client');

    api.addFiles([
        'OAuth.html',
        'OAuth.js',
    ], 'client');
});
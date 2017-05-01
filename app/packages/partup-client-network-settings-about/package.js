Package.describe({
    name: 'partup-client-network-settings-about',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'partup-lib',
        'ecmascript',
    ], ['client', 'server']);

    api.use([
        'templating',
        'aldeed:autoform',
        'reactive-dict'
    ], 'client');

    api.addFiles([

        'NetworkSettingsAbout.html',
        'NetworkSettingsAbout.js',
        'ContentBlockForm.html',
        'ContentBlockForm.js',
        'ContentBlockView.html',
        'ContentBlockView.js'

    ], 'client');

});

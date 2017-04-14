Package.describe({
    name: 'partup-client-network-settings-access',
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

        'NetworkSettingsAccess.html',
        'NetworkSettingsAccess.js'

    ], 'client');

});

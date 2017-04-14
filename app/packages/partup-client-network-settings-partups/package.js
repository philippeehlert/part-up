Package.describe({
    name: 'partup-client-network-settings-partups',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'partup-lib',
        'meteorhacks:subs-manager',
        'ecmascript',
    ], ['client', 'server']);

    api.use([
        'templating'
    ], 'client');

    api.addFiles([

        'NetworkSettingsPartups.html',
        'NetworkSettingsPartups.js'

    ], 'client');

});

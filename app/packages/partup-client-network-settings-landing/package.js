Package.describe({
    name: 'partup-client-network-settings-landing',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'partup-lib',
        'meteorhacks:subs-manager',
        'ecmascript',
        'templating',
        'aldeed:autoform',
    ], ['client']);

    api.addFiles([

        'NetworkSettingsLanding.html',
        'NetworkSettingsLanding.js'

    ], 'client');

});

Package.describe({
    name: 'partup-client-partupsettings',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'aldeed:autoform',
        'reactive-var',
        'reactive-dict',
        'ecmascript',
    ], 'client');

    api.addFiles([

        'BoardSwitch.html',
        'BoardSwitch.js',

        'Partupsettings.html',
        'Partupsettings.js'

    ], 'client');

});

Package.describe({
    name: 'partup-client-upper-tile',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup-lib',
        'ecmascript',
    ], 'client');

    api.addFiles([

        'UpperTile.html',
        'UpperTile.js',
        'InviteTile.html',
        'InviteTile.js'

    ], 'client');

});

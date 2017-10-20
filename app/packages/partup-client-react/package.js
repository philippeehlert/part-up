Package.describe({
    name: 'partup-client-react',
    version: '0.0.1',
    summary: '',
    documentation: null,
});

Package.onUse((api) => {

    api.use([
        'templating',
        'ecmascript',
        'fourseven:scss',
        'iron:router',
    ], 'client');

    api.addFiles([
        'blaze/ReactDashboard.html',
        'blaze/ReactDashboard.js',
    ], 'client');
});

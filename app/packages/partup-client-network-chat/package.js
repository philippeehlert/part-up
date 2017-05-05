Package.describe({
    name: 'partup-client-network-chat',
    version: '0.0.1',
    summary: '',
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
        'NetworkChat.html',
        'NetworkChat.js',
        'NetworkChatSidebar.html',
        'NetworkChatSidebar.js'
    ], 'client');

});

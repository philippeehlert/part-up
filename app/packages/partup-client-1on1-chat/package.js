Package.describe({
  name: 'partup-client-1on1-chat',
  version: '0.0.1',
  summary: '',
  documentation: null,
});

Package.onUse(function(api) {
  api.use(['ecmascript'], ['client', 'server']);

  api.use(
    ['partup-client-base', 'templating', 'partup-lib', 'reactive-var'],
    'client'
  );

  api.addFiles(
    [
      'OneOnOneChat.html',
      'OneOnOneChat.js',
      'OneOnOneChatSidebar.html',
      'OneOnOneChatSidebar.js',
    ],
    'client'
  );
});

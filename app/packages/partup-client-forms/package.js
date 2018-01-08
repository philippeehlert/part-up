Package.describe({
  name: 'partup-client-forms',
  version: '0.0.1',
  summary: '',
});

Package.onUse(function(api) {
  api.use(['templating'], ['client']);

  api.addFiles(['info/markdown-support/markdown-support.html'], ['client']);
});

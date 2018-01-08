Template.registerHelper('partupLoading', function() {
  let types = arguments;
  let template = Template.instance();
  if (!template.loading) template.loading = new ReactiveDict();

  let isLoading = false;
  lodash.each(types, function(type) {
    if (template.loading.get(type)) {
      isLoading = true;
      return; // break
    }
  });

  return isLoading;
});

Template.registerHelper('partupRefreshed', function() {
  return Meteor.status().retryCount === 0;
});

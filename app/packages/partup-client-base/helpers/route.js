Template.registerHelper('partupRoute', function(routeName) {
  return Router.current().route.getName() === routeName;
});

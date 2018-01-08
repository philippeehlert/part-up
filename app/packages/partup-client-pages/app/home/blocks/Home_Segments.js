Template.Home_Segments.events({
  'click [data-segment-search-button]': function(event, template) {
    event.preventDefault();
    Router.go('discover');
  },
});

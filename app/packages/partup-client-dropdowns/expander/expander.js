Template.PartupExpander.onCreated(function() {
  let template = this;

  template.expanded = new ReactiveVar(false);
});

Template.PartupExpander.events({
  'click [data-button]': function(event, template) {
    event.preventDefault();

    template.expanded.set(!template.expanded.curValue);
  },
});

Template.PartupExpander.helpers({
  state: function() {
    let template = Template.instance();
    return {
      expanded: function() {
        return template.expanded.get();
      },
    };
  },
});

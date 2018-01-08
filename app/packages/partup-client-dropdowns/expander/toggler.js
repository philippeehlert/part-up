Template.PartupToggler.onCreated(function() {
  let template = this;

  const { reactiveExpander } = this.data;

  template.expanded = reactiveExpander || new ReactiveVar(false);
});

Template.PartupToggler.events({
  'click [data-toggle]': function(event, template) {
    event.preventDefault();

    let newValue = !template.expanded.curValue;

    template.expanded.set(newValue);

    if (template.data.onToggle && newValue) _.defer(template.data.onToggle);
  },
});

Template.PartupToggler.helpers({
  state: function() {
    let template = Template.instance();
    return {
      expanded: function() {
        return template.expanded.get();
      },
    };
  },
});

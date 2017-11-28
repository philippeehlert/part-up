Template.PartupToggler.onCreated(function() {
    var template = this;

    const { reactiveExpander } = this.data;

    template.expanded = reactiveExpander || new ReactiveVar(false);
});

Template.PartupToggler.events({
    'click [data-toggle]': function(event, template) {
        event.preventDefault();

        var newValue = !template.expanded.curValue;

        template.expanded.set(newValue);

        if (template.data.onToggle && newValue) _.defer(template.data.onToggle);
    },
});

Template.PartupToggler.helpers({
    state: function() {
        var template = Template.instance();
        return {
            expanded: function() {
                return template.expanded.get();
            },
        };
    }
});

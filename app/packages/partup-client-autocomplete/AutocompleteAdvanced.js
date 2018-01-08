Template.AutocompleteAdvanced.onCreated(function() {
  let tpl = this;
  this.selection = this.data.selection || new ReactiveVar();
  this.id = Random.id();
  if (this.data.hasValueVar) {
    this.onInput = function(event) {
      tpl.data.hasValueVar.set(event.currentTarget.value);
    };
  }
});

Template.AutocompleteAdvanced.onRendered(function() {
  this.forminput = this.find('input[name]');
  this.forminput.type = 'hidden';
  $('[data-input]').on('input', this.onInput);
});

Template.AutocompleteAdvanced.helpers({
  selection: function() {
    return Template.instance().selection.get();
  },
  id: function() {
    return Template.instance().id;
  },
  onInterceptedQuery: function() {
    return this.onQuery;
  },
  onInterceptedSelect: function() {
    let tpl = Template.instance();
    let self = this;

    return function(selection) {
      tpl.selection.set(selection);
      tpl.forminput.value = self.formValue(selection);
      if (self.onSelect) self.onSelect(selection);
    };
  },
  selectorAttribute: function() {
    return this.selectorAttribute;
  },
});

Template.AutocompleteAdvanced.events({
  'click [data-clear]': function(event, template) {
    event.preventDefault();
    template.selection.set(undefined);
    template.forminput.value = '';

    Meteor.defer(function() {
      let query_input = $('.tt-input[data-queryinput="' + template.id + '"]');
      query_input.focus();
    });
  },
});

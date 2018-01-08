Template.DiscoverPartupsTribeSelector.onCreated(function() {
  let template = this;
  template.dropdownToggleBool = 'partial-dropdowns-networks-actions.opened';
  template.dropdownOpen = new ReactiveVar(false, function(a, b) {
    Partup.client.verySpecificHelpers.setReactiveVarToBoolValueIfFalseAfterDelay(
      b,
      template.data.config.reactiveState,
      200
    );
  });
  template.emptyOption = {
    name: 'All',
  };
  template.selectedOption = template.data.config.reactiveValue;
  template.selectedOption.set(template.emptyOption);
});

Template.DiscoverPartupsTribeSelector.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.DiscoverPartupsTribeSelector.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.DiscoverPartupsTribeSelector.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function eventSelectOption(event, template) {
    event.preventDefault();
    template.selectedOption.set(this);
    template.find('[data-container]').scrollTop = 0;
  },
});

Template.DiscoverPartupsTribeSelector.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
  selectedOption: function() {
    return Template.instance().selectedOption.get();
  },
  options: function() {
    let template = Template.instance();
    return template.data.config.options;
  },
  selected: function(input) {
    let template = Template.instance();
    return input === template.selectedOption.get();
  },
  emptyOption: function() {
    return Template.instance().emptyOption;
  },
});

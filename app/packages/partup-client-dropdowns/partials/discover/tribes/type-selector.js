Template.DiscoverTribesTypeSelector.onCreated(function() {
  let template = this;
  template.dropdownToggleBool =
    'partial-dropdowns-networks-actions-type.opened';
  template.dropdownOpen = new ReactiveVar(false, function(a, b) {
    Partup.client.verySpecificHelpers.setReactiveVarToBoolValueIfFalseAfterDelay(
      b,
      template.data.config.reactiveState,
      200
    );
  });
  template.selectedOption = template.data.config.reactiveValue;

  template.options = [
    {
      name: TAPi18n.__('pages-app-discover-tribes-filter-type-all'),
      value: undefined,
    },
    {
      name: TAPi18n.__('pages-app-discover-tribes-filter-type-public'),
      value: 'public',
    },
    {
      name: TAPi18n.__('pages-app-discover-tribes-filter-type-closed'),
      value: 'closed',
    },
  ];

  template.selectedOption.set(template.options[0]);
});

Template.DiscoverTribesTypeSelector.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.DiscoverTribesTypeSelector.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.DiscoverTribesTypeSelector.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function eventSelectOption(event, template) {
    event.preventDefault();
    template.selectedOption.set(this);
    template.find('[data-container]').scrollTop = 0;
  },
});

Template.DiscoverTribesTypeSelector.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
  selectedOption: function() {
    return Template.instance().selectedOption.get();
  },
  options: function() {
    return Template.instance().options;
  },
  selected: function(input) {
    let template = Template.instance();
    return input === template.selectedOption.get();
  },
  emptyOption: function() {
    return Template.instance().emptyOption;
  },
});

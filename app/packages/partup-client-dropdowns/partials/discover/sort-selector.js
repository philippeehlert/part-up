Template.DiscoverSortSelector.onCreated(function() {
  let template = this;
  template.dropdownToggleBool =
    'partial-dropdowns-networks-actions-sort.opened';
  template.dropdownOpen = new ReactiveVar(false);
  template.selectedOption = template.data.reactiveVar;

  template.options = [
    {
      name: TAPi18n.__('pages-app-discover-filter-sorting-type-newest'),
      value: 'new',
    },
    {
      name: TAPi18n.__('pages-app-discover-filter-sorting-type-popular'),
      value: 'popular',
    },
  ];

  let defaultOption = template.options[0];

  if (template.data.default === 'popular') {
    defaultOption = template.options[1];
  }

  template.selectedOption.set(defaultOption);
});

Template.DiscoverSortSelector.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.DiscoverSortSelector.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.DiscoverSortSelector.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function eventSelectOption(event, template) {
    event.preventDefault();
    template.selectedOption.set(this);
    template.find('[data-container]').scrollTop = 0;
  },
});

Template.DiscoverSortSelector.helpers({
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

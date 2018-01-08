Template.DiscoverLanguageSelector.onCreated(function() {
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
    native_name: TAPi18n.__('pages-app-discover-filter-language-sector-all'),
  };
  template.selectedOption = template.data.config.reactiveValue;
  template.selectedOption.set(template.emptyOption);
  template.subscribe('languages.all');
});

Template.DiscoverLanguageSelector.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.DiscoverLanguageSelector.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.DiscoverLanguageSelector.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function eventSelectOption(event, template) {
    event.preventDefault();
    template.selectedOption.set(this);
    template.find('[data-container]').scrollTop = 0;
  },
});

Template.DiscoverLanguageSelector.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
  selectedOption: function() {
    return Template.instance().selectedOption.get();
  },
  options: function() {
    return Languages.find().fetch();
  },
  selected: function(input) {
    let template = Template.instance();
    return input === template.selectedOption.get();
  },
  emptyOption: function() {
    return Template.instance().emptyOption;
  },
});

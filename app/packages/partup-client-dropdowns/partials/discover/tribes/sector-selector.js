Template.DiscoverTribesSectorSelector.onCreated(function() {
  let template = this;
  let options = [
    {
      _id: undefined,
      name: undefined,
      phrase_key: TAPi18n.__('pages-app-discover-tribes-filter-sector-all'),
    },
  ];
  template.options = new ReactiveVar(options);
  template.subscribe('sectors.all', {
    onReady: function() {
      let sectors = Sectors.find().fetch();

      // var selectableSectors = (sectors || []).map(function(sector, index) {
      //     return {
      //         _id: sector._id
      //         name: sector.name,
      //         phrase_key: sector.phrase_key
      //     };
      // });

      let newOptions = options.concat(sectors || []);

      template.options.set(newOptions);
      template.selectedOption.set(newOptions[0]);
    },
  });

  template.dropdownToggleBool =
    'partial-dropdowns-networks-actions-sector.opened';
  template.dropdownOpen = new ReactiveVar(false, function(a, b) {
    Partup.client.verySpecificHelpers.setReactiveVarToBoolValueIfFalseAfterDelay(
      b,
      template.data.config.reactiveState,
      200
    );
  });
  template.selectedOption = template.data.config.reactiveValue;
});

Template.DiscoverTribesSectorSelector.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.DiscoverTribesSectorSelector.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.DiscoverTribesSectorSelector.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function eventSelectOption(event, template) {
    event.preventDefault();
    template.selectedOption.set(this);
    template.find('[data-container]').scrollTop = 0;
  },
});

Template.DiscoverTribesSectorSelector.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
  selectedOption: function() {
    return Template.instance().selectedOption.get();
  },
  options: function() {
    return Template.instance().options.get();
  },
  selected: function(input) {
    let template = Template.instance();
    return input === template.selectedOption.get();
  },
  emptyOption: function() {
    return Template.instance().emptyOption;
  },
});

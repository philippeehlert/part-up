Template.PartialDropdownNetworkActions.onCreated(function() {
  let template = this;
  template.dropdownToggleBool = 'partial-dropdowns-networks-actions.opened';
  template.dropdownOpen = new ReactiveVar(false);
  template.selectedOption =
    template.data.reactiveVar || new ReactiveVar('active');
});

Template.PartialDropdownNetworkActions.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.PartialDropdownNetworkActions.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.PartialDropdownNetworkActions.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function eventSelectOption(event, template) {
    let key = $(event.currentTarget).data('translate');
    template.selectedOption.set(
      key.replace('dropdowns-networksactions-option-', '')
    );
  },
});

Template.PartialDropdownNetworkActions.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
  selectedAction: function() {
    return TAPi18n.__(
      'dropdowns-networksactions-option-' +
        Template.instance().selectedOption.get()
    );
  },
  notSelected: function(a) {
    return (
      a !==
      'dropdowns-networksactions-option-' +
        Template.instance().selectedOption.get()
    );
  },
});

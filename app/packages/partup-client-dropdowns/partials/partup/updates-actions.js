Template.PartialDropdownUpdatesActions.onCreated(function() {
  let template = this;
  template.dropdownToggleBool = 'partial-dropdowns-updates-actions.opened';
  template.dropdownOpen = new ReactiveVar(false);
  template.selectedOption =
    template.data.reactiveVar || new ReactiveVar('default');
});

Template.PartialDropdownUpdatesActions.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.PartialDropdownUpdatesActions.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.PartialDropdownUpdatesActions.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function(event, template) {
    let key = $(event.currentTarget).data('translate');
    template.selectedOption.set(
      key.replace('dropdowns-updatesactions-option-', '')
    );
  },
});

Template.PartialDropdownUpdatesActions.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
  selectedAction: function() {
    return TAPi18n.__(
      'dropdowns-updatesactions-option-' +
        Template.instance().selectedOption.get()
    );
  },
  notSelected: function(a) {
    return (
      a !==
      'dropdowns-updatesactions-option-' +
        Template.instance().selectedOption.get()
    );
  },
});

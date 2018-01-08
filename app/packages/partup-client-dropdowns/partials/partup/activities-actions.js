Template.PartialDropdownActivitiesActions.onCreated(function() {
  let tpl = this;
  tpl.dropdownToggleBool = 'partial-dropdowns-activities-actions.opened';
  tpl.dropdownOpen = new ReactiveVar(false);
  tpl.selectedOption = tpl.data.reactiveVar || new ReactiveVar('default');
});

Template.PartialDropdownActivitiesActions.onRendered(function() {
  let tpl = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    tpl,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.PartialDropdownActivitiesActions.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.PartialDropdownActivitiesActions.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function(event, template) {
    let key = $(event.currentTarget).data('translate');
    template.selectedOption.set(
      key.replace('dropdowns-activitiesactions-option-', '')
    );
  },
});

Template.PartialDropdownActivitiesActions.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
  selectedAction: function() {
    return TAPi18n.__(
      'dropdowns-activitiesactions-option-' +
        Template.instance().selectedOption.get()
    );
  },
  notSelected: function(a) {
    return (
      a !==
      'dropdowns-activitiesactions-option-' +
        Template.instance().selectedOption.get()
    );
  },
});

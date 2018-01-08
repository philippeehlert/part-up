Template.NetworkMenu.onCreated(function() {
  let template = this;
  template.dropdownOpen = new ReactiveVar(false);
});

Template.NetworkMenu.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu=networksettings]'
  );
  Router.onBeforeAction(function(req, res, next) {
    template.dropdownOpen.set(false);
    next();
  });
});

Template.NetworkMenu.onDestroyed(function() {
  let template = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(template);
});

Template.NetworkMenu.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
});

Template.NetworkMenu.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
});

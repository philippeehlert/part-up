Template.DropdownLanguageSelector.onCreated(function() {
  let template = this;
  template.dropdownOpen = new ReactiveVar(false);
});
Template.DropdownLanguageSelector.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    null,
    '[data-toggle-menu=menu]',
    function() {
      ClientDropdowns.partupNavigationSubmenuActive.set(false);
    }
  );
  Router.onBeforeAction(function(req, res, next) {
    template.dropdownOpen.set(false);
    next();
  });
});

Template.DropdownLanguageSelector.onDestroyed(function() {
  let template = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(template);
});

Template.DropdownLanguageSelector.events({
  'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]':
    Partup.client.scroll.preventScrollPropagation,
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler.bind(
    null,
    'top-level'
  ),
});

Template.DropdownLanguageSelector.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
  language: function() {
    return TAPi18n.__('app-language-' + Partup.client.language.current.get());
  },
});

Template.DropdownLanguageSelector_Content.helpers({
  language: function() {
    return Partup.client.language.current.get();
  },
});

Template.DropdownLanguageSelector_Content.events({
  'click [data-language]': function(event, template) {
    event.preventDefault();
    Partup.client.language.change($(event.currentTarget).data('language'));
  },
});

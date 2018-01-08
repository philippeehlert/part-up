Template.DropdownMenu.onCreated(function() {
  let template = this;
  template.dropdownOpen = new ReactiveVar(false);
});
Template.DropdownMenu.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
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

Template.DropdownMenu.onDestroyed(function() {
  let template = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(template);
});

Template.DropdownMenu.events({
  'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]':
    Partup.client.scroll.preventScrollPropagation,
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler.bind(
    null,
    'top-level'
  ),

  // For now this is pasted from the 'Home_Footer.js' file.
  'click [data-help-intercom]': function(event, template) {
    event.preventDefault();

    if (Intercom) {
      Intercom('showNewMessage', 'Stel je vraag/Ask a question:');
    } else {
      console.log('Intercom not available.');
    }
  },

  // Commented for later use.
  // 'click [data-feedback]': function(event, template) {
  //     event.preventDefault();
  //     var $intercom = $('#intercom-launcher');
  //     if ($intercom.length > 0) {
  //         if(Intercom) {
  //             Intercom('showNewMessage');
  //         }
  //     } else {
  //         window.location.href = 'mailto:' + TAPi18n.__('footer-feedback-button-mailto') + '?subject=' + TAPi18n.__('footer-feedback-button-mailto-subject');
  //     }
  // }
});

Template.DropdownMenu.helpers({
  menuOpen: function() {
    return Template.instance().dropdownOpen.get();
  },
});

let DROPDOWN_TRIGGER = '.dropdown__trigger';
let DROPDOWN = '.dropdown';

let directions = Object.freeze({
  NORTH: 'N',
  EAST: 'E',
  SOUTH: 'S',
  WEST: 'W',
});

let options = {
  key: '',
  position: '',
  direction: '',
};

/**
 * Render dropdowns
 *
 * @module client-dropdowns
 */
ClientDropdowns = {
  preventCloseAll: false,
  partupNavigationSubmenuActive: new ReactiveVar(false),
  ajustBrightness: function(active) {
    if (!active) {
      $('.pu-page').css({
        '-webkit-filter': 'none',
        '-moz-filter': 'none',
        '-ms-filter': 'none',
        'filter': 'none',
        'pointerEvents': 'auto',
      });
      return;
    }

    $('.pu-page').css({
      '-webkit-filter': 'brightness(89%)',
      '-moz-filter': 'brightness(89%)',
      '-ms-filter': 'brightness(89%)',
      'filter': 'brightness(89%)',
      'pointer-events': 'none',
    });
  },
  addOutsideDropdownClickHandler: function(
    template,
    dropdownSelector,
    buttonSelector,
    onClose
  ) {
    // find the dropdown
    let dropdown = template.find(dropdownSelector);

    // find the toggle button
    let button = template.find(buttonSelector);

    // on click outside
    template.onClickOutsideHandler = Partup.client.elements.onClickOutside(
      [dropdown, button],
      function() {
        if (
          onClose &&
          template.dropdownOpen.curValue &&
          !ClientDropdowns.preventCloseAll
        ) {
          onClose();
        }
        template.dropdownOpen.set(false);
      }
    );
  },
  removeOutsideDropdownClickHandler: function(template) {
    Partup.client.elements.offClickOutside(template.onClickOutsideHandler);
  },
  dropdownClickHandler: function(arg1, arg2, arg3) {
    let event;
    let template;
    let topLevel = false;
    if (typeof arg1 === 'string') {
      event = arg2;
      template = arg3;
      topLevel = true;
    } else {
      event = arg1;
      template = arg2;
    }
    event.preventDefault(); // prevent href behaviour
    // get current state of the dropdown
    let dropdownOpen = template.dropdownOpen.get();
    template.dropdownOpen.set(!dropdownOpen);

    if (topLevel) {
      ClientDropdowns.partupNavigationSubmenuActive.set(!dropdownOpen);
      ClientDropdowns.preventCloseAll = true;
      _.defer(function() {
        ClientDropdowns.preventCloseAll = false;
      });
    }
  },
};

Meteor.startup(function() {
  Router.onBeforeAction(function() {
    ClientDropdowns.partupNavigationSubmenuActive.set(false);
    this.next();
  });

  Meteor.autorun(function() {
    let active = ClientDropdowns.partupNavigationSubmenuActive.get();

    ClientDropdowns.ajustBrightness(active);
  });
});

Partup.client.ClientDropdowns = ClientDropdowns;

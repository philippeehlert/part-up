Template.ProfileNavigationSelector.onCreated(function() {
  let template = this;
  template.dropdownToggleBool =
    'partial-dropdowns-networks-actions-sort.opened';
  template.dropdownOpen = new ReactiveVar(false);

  let profileId = template.data._id;
  let firstName = template.data.firstName;

  template.options = [
    {
      name: TAPi18n.__('pages-app-profile-about-nav', {
        name: firstName,
      }),
      route: 'profile',
      routeId: profileId,
    },
    {
      name: TAPi18n.__('pages-app-profile-upper-partups-nav'),
      route: 'profile-upper-partups',
      routeId: profileId,
    },
    {
      name: TAPi18n.__('pages-app-profile-supporter-partups-nav'),
      route: 'profile-supporter-partups',
      routeId: profileId,
    },
    {
      name: TAPi18n.__('pages-app-profile-partners-nav'),
      route: 'profile-partners',
      routeId: profileId,
    },
  ];

  if (profileId === Meteor.userId()) {
    template.options.push({
      name: TAPi18n.__('pages-app-network-tab-button-settings'),
      route: 'profile-settings',
      routeId: profileId,
    });
  }

  let defaultOption = template.options[0];

  if (template.data.default === 'profile') {
    defaultOption = template.options[0];
  }
  if (template.data.default === 'profile-upper-partups') {
    defaultOption = template.options[1];
  }
  if (template.data.default === 'profile-supporter-partups') {
    defaultOption = template.options[2];
  }
  if (template.data.default === 'profile-partners') {
    defaultOption = template.options[3];
  }

  template.selectedOption = new ReactiveVar(defaultOption, function(
    oldRoute,
    newRoute
  ) {
    if (oldRoute === newRoute) return;
    Router.go(newRoute.route, { _id: newRoute.routeId });
  });
});

Template.ProfileNavigationSelector.onRendered(function() {
  let template = this;
  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu]'
  );
});

Template.ProfileNavigationSelector.onDestroyed(function() {
  let tpl = this;
  ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.ProfileNavigationSelector.events({
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
  'click [data-select-option]': function(event, template) {
    event.preventDefault();
    template.selectedOption.set(this);
    template.find('[data-container]').scrollTop = 0;
  },
});

Template.ProfileNavigationSelector.helpers({
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

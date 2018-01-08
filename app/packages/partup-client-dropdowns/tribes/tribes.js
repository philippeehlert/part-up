import _ from 'lodash';
import MenuStateManager from './menustatemanager';

Template.DropdownTribes.onCreated(function() {
  let template = this;

  // The tribe used to decide which part-ups to load in the extended menu
  template.activeTribeId = new ReactiveVar(undefined);
  template.showPartups = new ReactiveVar(false);

  // Renaming any of the variable declarations below requires them updated in the 'MenuStageManager' as well!
  template.loadingNetworks = new ReactiveVar(false);
  template.loadingUpperPartups = new ReactiveVar(true);
  template.loadingSupporterPartups = new ReactiveVar(true);

  template.query = {
    token: Accounts._storedLoginToken(),
  };
  template.results = {
    networks: new ReactiveVar([], (oldVal, newVal) => {
      template.loadingNetworks.set(false);
    }),
    upperPartups: new ReactiveVar([], (oldVal, newVal) => {
      template.loadingUpperPartups.set(false);
    }),
    supporterPartups: new ReactiveVar([], (oldVal, newVal) => {
      template.loadingSupporterPartups.set(false);
    }),
  };
  // untill here.

  template.dropdownOpen = new ReactiveVar(false, function(oldValue, newValue) {
    // Prevents running the code the first time this get's set and the dropdown has not been opened yet
    if (!newValue) return;
    MenuStateManager.update(template);
  });

  template.viewHandler = {
    currentWidth: 0,
    calculateWidth() {
      let width = template.$('[data-toggle-menu]').outerWidth(true);
      if (currentWidth !== width) {
        $('[data-before]').css('width', width - 19);
        currentWidth = width;
      }
    },
    // handleXPos(event) {
    // 	$(event.currentTarget).parent().find('[data-inner]').css({
    // 		left: (event.offsetX - 30) + 'px',
    // 		display: 'block',
    // 		pointerEvents: 'auto'
    // 	});
    // }
  };
});

// After render template handler
Template.DropdownTribes.onRendered(function() {
  let template = this;

  Router.onBeforeAction(function(req, res, next) {
    template.dropdownOpen.set(false);
    template.showPartups.set(false);
    next();
  });

  ClientDropdowns.addOutsideDropdownClickHandler(
    template,
    '[data-clickoutside-close]',
    '[data-toggle-menu=tribes]',
    function() {
      ClientDropdowns.partupNavigationSubmenuActive.set(false);
      template.showPartups.set(false);
    }
  );

  $(window).on('resize', template.viewHandler.calculateWidth);
  template.viewHandler.calculateWidth();
});

// Dispose of everything.
Template.DropdownTribes.onDestroyed(function() {
  let template = this;

  ClientDropdowns.removeOutsideDropdownClickHandler(template);
  $(window).off('resize', template.viewHandler.calculateWidth);
});

// Blaze helpers
Template.DropdownTribes.helpers({
  menuOpen: () => Template.instance().dropdownOpen.get(),
  showPartups: () => Template.instance().showPartups.get(),
  loadingNetworks: () => Template.instance().loadingNetworks.get(),
  loadingUpperPartups: () => Template.instance().loadingUpperPartups.get(),
  loadingSupporterPartups: () =>
    Template.instance().loadingSupporterPartups.get(),
  currentTribeId: () => Template.instance().activeTribeId.get(),
  currentTribeSlug() {
    let t = Template.instance();
    const network = _.find(t.results.networks.get(), {
      _id: t.activeTribeId.get(),
    });
    return network ? network.slug : 'none';
  },
  isMemberOfNetwork: (network) =>
    network.uppers.find((userId) => userId === Meteor.userId()),
  networks() {
    return lodash.sortByOrder(
      Template.instance().results.networks.get(),
      (network) => network.name.toLowerCase(),
      ['asc']
    );
  },
  upperPartups() {
    const template = Template.instance();
    const upperPartups = template.results.upperPartups.get();
    const activeTribeId = template.activeTribeId.get();
    if (upperPartups.length < 1) {
      return;
    }
    const partups = lodash.sortByOrder(
      _.filter(upperPartups, (partup) => partup.network_id === activeTribeId),
      (partup) => partup.name.toLowerCase(),
      ['asc']
    );
    return partups;
  },
  supporterPartups() {
    const template = Template.instance();
    const supporterPartups = template.results.supporterPartups.get();
    const activeTribeId = template.activeTribeId.get();
    if (supporterPartups.length < 1) {
      return;
    }
    const partups = lodash.sortByOrder(
      _.filter(
        supporterPartups,
        (partup) => partup.network_id === activeTribeId
      ),
      (partup) => partup.name.toLowerCase(),
      ['asc']
    );
    return partups;
  },
  newUpdates() {
    return _.reduce(
      _.map(
        _.filter(
          this.upper_data || [],
          (upperdata) => upperdata._id === Meteor.userId()
        ),
        (upperdata) => upperdata.new_updates.length
      ),
      (count, n) => (count = count + n),
      null
    );
  },
  isTabletOrMobile() {
    return Partup.client.isMobile.isTabletOrMobile();
  },
});

// Template events
Template.DropdownTribes.events({
  'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]':
    Partup.client.scroll.preventScrollPropagation,
  'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler.bind(
    null,
    'top-level'
  ),
  'mouseenter [data-hover]': function(event, template) {
    let windowWidth = window.innerWidth;
    if (windowWidth < 992) return;

    $('[data-hidehohover]').removeClass('scrolling');
    let tribeId = $(event.currentTarget).data('hover');
    template.showPartups.set(false);
    if (template.activeTribeId.curValue !== tribeId) {
      template.activeTribeId.set(tribeId);
    }
    template.showPartups.set(true);
  },
  'click [data-hover]': function(event, template) {
    let windowWidth = window.innerWidth;

    if (Partup.client.isMobile.isTabletOrMobile()) {
      event.preventDefault();

      $('[data-hidehohover]').removeClass('scrolling');
      let tribeId = $(event.currentTarget).data('hover');
      template.showPartups.set(false);
      if (template.activeTribeId.curValue !== tribeId) {
        template.activeTribeId.set(tribeId);
      }
      template.showPartups.set(true);
    }
  },
  'mouseleave [data-clickoutside-close]': function(event, template) {
    template.showPartups.set(false);
  },
  'click [data-button-back]': function(event, template) {
    event.preventDefault();
    template.showPartups.set(false);
  },
});

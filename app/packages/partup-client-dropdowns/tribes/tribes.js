import _ from 'lodash';
import MenuStateManager from './menustatemanager';

Template.DropdownTribes.onCreated(function () {
	var template = this;

	// The tribe used to decide which part-ups to load in the extended menu
	template.activeTribeId = new ReactiveVar(undefined);
	template.showPartups = new ReactiveVar(false);

	// Renaming any of the variable declarations below requires them updated in the 'MenuStageManager' as well!
	template.loadingNetworks = new ReactiveVar(false);
	template.loadingPartups = new ReactiveVar(false, (oldVal, newVal) => {
		if (newVal) return; // Remove this line if we always want to check for networks if we start loading part-ups (to pre-fetch the networks the user is already a member of)
		MenuStateManager.updateNetworks(template, Meteor.user());
	});
	template.loadingUpperPartups = new ReactiveVar(true, (oldVal, newVal) => {
		if (!newVal && template.loadingSupporterPartups.get() === false) {
			template.loadingPartups.set(false);
		}
	});
	template.loadingSupporterPartups = new ReactiveVar(true, (oldVal, newVal) => {
		if (!newVal && template.loadingUpperPartups.get() === false) {
			template.loadingPartups.set(false);
		}
	});

	template.query = {
		token: Accounts._storedLoginToken(),
		archived: false // Shouldn't we just specify this on the server side?
	};
	template.results = {
		networks: new ReactiveVar([]),
		upperPartups: new ReactiveVar([], (oldVal, newVal) => {
			template.loadingUpperPartups.set(false);
		}),
		supporterPartups: new ReactiveVar([], (oldVal, newVal) => {
			template.loadingSupporterPartups.set(false);
		})
	};
	// untill here.

	template.dropdownOpen = new ReactiveVar(false, function (oldValue, newValue) {
		// Prevents running the code the first time this get's set and the dropdown has not been opened yet
		if (!newValue) return;
		if (template.loadingPartups.get() || template.loadingNetworks.get()) return;

		// Manages the partups and networks;
		MenuStateManager.updatePartups(template, Meteor.user());
	});

	template.viewHandler = {
		currentWidth: 0,
		calculateWidth() {
			var width = template.$('[data-toggle-menu]').outerWidth(true);
			if (currentWidth !== width) {
				$('[data-before]').css('width', width - 19);
				currentWidth = width;
			}
		}
		// handleXPos(event) {
		// 	$(event.currentTarget).parent().find('[data-inner]').css({
		// 		left: (event.offsetX - 30) + 'px',
		// 		display: 'block',
		// 		pointerEvents: 'auto'
		// 	});
		// }
	}
});

// After render template handler
Template.DropdownTribes.onRendered(function () {
	var template = this;

	Router.onBeforeAction(function (req, res, next) {
		template.dropdownOpen.set(false);
		next();
	});

	ClientDropdowns.addOutsideDropdownClickHandler(
		template
		, '[data-clickoutside-close]'
		, '[data-toggle-menu=tribes]'
		, function () {
			ClientDropdowns.partupNavigationSubmenuActive.set(false);
		}
	);

	$(window).on('resize', template.viewHandler.calculateWidth);
	template.viewHandler.calculateWidth();
});

// Dispose of everything.
Template.DropdownTribes.onDestroyed(function () {
	var template = this;

	ClientDropdowns.removeOutsideDropdownClickHandler(template);
	$(window).off('resize', template.viewHandler.calculateWidth);
});

// Blaze helpers
Template.DropdownTribes.helpers({
	menuOpen: () => Template.instance().dropdownOpen.get(),
	showPartups: () => Template.instance().showPartups.get(),
	loadingNetworks: () => Template.instance().loadingNetworks.get(),
	loadingUpperPartups: () => Template.instance().loadingUpperPartups.get(),
	loadingSupporterPartups: () => Template.instance().loadingSupporterPartups.get(),
	currentTribeId: () => Template.instance().activeTribeId.get(),
	currentTribeSlug() {
		var t = Template.instance();
		return _.find(t.results.networks.get(), t.activeTribeId.get());
	},
	isMemberOfNetwork: network => network.uppers.find(userId => userId === Meteor.userId()),
	networks() {
		return lodash.sortByOrder(Template.instance().results.networks.get(), network => network.name.toLowerCase(), ['asc'])
	},
	upperPartups() {
		const template = Template.instance();
		const upperPartups = template.results.upperPartups.get();
		const activeTribeId = template.activeTribeId.get();
		if (upperPartups.length < 1) {
			return;
		}
		const partups = lodash.sortByOrder(
			_.filter(upperPartups, partup => partup.network_id === activeTribeId)
			, partup => partup.name.toLowerCase()
			, ['asc']
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
			_.filter(supporterPartups, partup => partup.network_id === activeTribeId)
			, partup => partup.name.toLowerCase()
			, ['asc']
		);
		return partups;
	}
});

// Template events
Template.DropdownTribes.events({
	'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]': Partup.client.scroll.preventScrollPropagation,
	'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler.bind(null, 'top-level'),
	'mouseenter [data-hover]': function (event, template) {
		var windowWidth = window.innerWidth;
		if (windowWidth < 992) return;

		$('[data-hidehohover]').removeClass('scrolling');
		var tribeId = $(event.currentTarget).data('hover');
		template.showPartups.set(false);
		if (template.activeTribeId.curValue !== tribeId) template.activeTribeId.set(tribeId);
		template.showPartups.set(true);
	},
	'click [data-hover]': function (event, template) {
		var windowWidth = window.innerWidth;

		if (windowWidth < 992) {
			event.preventDefault();

			$('[data-hidehohover]').removeClass('scrolling');
			var tribeId = $(event.currentTarget).data('hover');
			template.showPartups.set(false);
			if (template.activeTribeId.curValue !== tribeId) template.activeTribeId.set(tribeId);
			template.showPartups.set(true);
		}
	},
	'mouseleave [data-clickoutside-close]': function (event, template) {
		template.showPartups.set(false);
	},
	'click [data-button-back]': function (event, template) {
		event.preventDefault();
		template.showPartups.set(false);
	}
});

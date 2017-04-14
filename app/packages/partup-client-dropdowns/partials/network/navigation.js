Template.NetworkNavigationSelector.onCreated(function() {
    var template = this;
    template.dropdownToggleBool = 'partial-dropdowns-networks-actions-navigation.opened';
    template.dropdownOpen = new ReactiveVar(false);

    var networkSlug = template.data.slug;
    var network = template.data.network;

    template.options = [{
        name: TAPi18n.__('pages-app-network-tab-button-partups'),
        route: 'network-detail',
        slug: networkSlug,
    },{
        name: TAPi18n.__('pages-app-network-tab-button-chat'),
        route: 'network-chat',
        slug: networkSlug,
    },{
        name: TAPi18n.__('pages-app-network-tab-button-uppers'),
        route: 'network-uppers',
        slug: networkSlug,
    },{
        name: TAPi18n.__('pages-app-network-tab-button-about'),
        route: 'network-about',
        slug: networkSlug,
    }];

    // if (network.isAdmin(Meteor.userId())) {
    //     template.options.push({
    //         name: TAPi18n.__('pages-app-network-tab-button-settings'),
    //         route: 'network-settings',
    //         slug: networkSlug,
    //     });
    // }

    var defaultOption = template.options[0];

    if (template.data.default === 'network-detail') defaultOption = template.options[0];
    if (template.data.default === 'network-chat') defaultOption = template.options[1];
    if (template.data.default === 'network-uppers') defaultOption = template.options[2];
    if (template.data.default === 'network-about') defaultOption = template.options[3];

    template.selectedOption = new ReactiveVar(defaultOption, function(oldRoute, newRoute) {
        if (oldRoute === newRoute) return;
        Router.go(newRoute.route, {slug: newRoute.slug});
    });
});

Template.NetworkNavigationSelector.onRendered(function() {
    var template = this;
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu]');
});

Template.NetworkNavigationSelector.onDestroyed(function() {
    var tpl = this;
    ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.NetworkNavigationSelector.events({
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
    'click [data-select-option]': function(event, template) {
        event.preventDefault();
        template.selectedOption.set(this);
        template.find('[data-container]').scrollTop = 0;
    }
});

Template.NetworkNavigationSelector.helpers({
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
        var template = Template.instance();
        return input === template.selectedOption.get();
    },
    emptyOption: function() {
        return Template.instance().emptyOption;
    }
});

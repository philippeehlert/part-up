Template.PartupNavigationSelector.onCreated(function() {
    var template = this;
    template.dropdownToggleBool = 'partial-dropdowns-networks-actions-sort.opened';
    template.dropdownOpen = new ReactiveVar(false);

    var partupSlug = template.data.slug;
    var partup = template.data.partup;

    template.options = [{
        name: TAPi18n.__('pages-app-partup-menu_conversations'),
        route: 'partup',
        slug: partupSlug,
        icon: 'message'
    },{
        name: TAPi18n.__('pages-app-partup-menu_activities'),
        route: 'partup-activities',
        slug: partupSlug,
        icon: 'chart'
    },{
        name: TAPi18n.__('pages-app-partup-menu_documents_abbr'),
        route: 'partup-documents',
        slug: partupSlug,
        icon: 'documents'
    },{
        name: TAPi18n.__('pages-app-partup-menu_updates'),
        route: 'partup-updates',
        slug: partupSlug,
        icon: 'globe'
    }];

    // if (partup.isEditableBy(Meteor.user())) {
    //     template.options.push({
    //         name: TAPi18n.__('pages-app-partup-menu_settings'),
    //         route: 'partup-settings',
    //         slug: partupSlug,
    //         icon: 'cog'
    //     });
    // }

    var defaultOption = template.options[0];

    if (template.data.default === 'partup') defaultOption = template.options[0];
    if (template.data.default === 'partup-activities') defaultOption = template.options[1];
    if (template.data.default === 'partup-documents') defaultOption = template.options[2];

    template.selectedOption = new ReactiveVar(defaultOption, function(oldRoute, newRoute) {
        if (oldRoute === newRoute) return;
        Router.go(newRoute.route, {slug: newRoute.slug});
    });
});

Template.PartupNavigationSelector.onRendered(function() {
    var template = this;
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu]');
});

Template.PartupNavigationSelector.onDestroyed(function() {
    var tpl = this;
    ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.PartupNavigationSelector.events({
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
    'click [data-select-option]': function(event, template) {
        event.preventDefault();
        template.selectedOption.set(this);
        template.find('[data-container]').scrollTop = 0;
    }
});

Template.PartupNavigationSelector.helpers({
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

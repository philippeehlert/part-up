/**
 * If you want to prefill values:
 * Use Partup.client.discover.setPrefill(key, value); before changing route
 * to Discover
 */

Template.app_discover_tribes_filter.onCreated(function() {
    var template = this;
    var updateQuery = function() {
        for (key in Partup.client.discover.DEFAULT_TRIBE_QUERY) {
            var fieldValue          = Partup.client.discover.current_tribe_query[key];
            var defaultFieldValue   = Partup.client.discover.DEFAULT_TRIBE_QUERY[key];

            Partup.client.discover.tribe_query.set(key, fieldValue || defaultFieldValue);
        }
    };
    template.selectedType = new ReactiveVar(undefined, function(a, b) {
        Partup.client.discover.current_tribe_query.type = (b && b.value) || undefined;
        updateQuery();
    });
    template.selectedSector = new ReactiveVar(undefined, function(a, b) {
        Partup.client.discover.current_tribe_query.sector_id = (b && b._id) || undefined;
        updateQuery();
    });
    template.searchQuery = new ReactiveVar(undefined, function(a, b) {
        Partup.client.discover.current_tribe_query.textSearch = b || undefined;
        updateQuery();
    });
    template.selectedLocation = new ReactiveVar(undefined, function(a, b) {
        Partup.client.discover.current_tribe_query.locationId = (b && b.id) || undefined;
        updateQuery();
    });
    template.locationHasValueVar = new ReactiveVar(undefined);
    template.selectedLanguage = new ReactiveVar(undefined, function(a, b) {
        Partup.client.discover.current_tribe_query.language = (b && b._id) || undefined;
        updateQuery();
    });

    template.sectorSelectorOpen = new ReactiveVar(false);
    template.typeSelectorOpen = new ReactiveVar(false);
    template.languageSelectorOpen = new ReactiveVar(false);
});
Template.app_discover_tribes_filter.onDestroyed(function() {
    var template = this;
    Partup.client.discover.resetTribeQuery();
});

Template.app_discover_tribes_filter.helpers({
    configs: function() {
        var template = Template.instance();

        return {
            sectorSelector: function() {
                return {
                    reactiveValue: template.selectedSector,
                    reactiveState: template.sectorSelectorOpen
                };
            },
            typeSelector: function() {
                return {
                    reactiveValue: template.selectedType,
                    reactiveState: template.typeSelectorOpen
                };
            },
            languageSelector: function() {
                return {
                    reactiveValue: template.selectedLanguage,
                    reactiveState: template.languageSelectorOpen
                };
            }
        };
    },
    state: function() {
        var template = Template.instance();

        return {
            sectorSelectorOpen: function() {
                return template.sectorSelectorOpen.get();
            },
            typeSelectorOpen: function() {
                return template.typeSelectorOpen.get();
            },
            languageSelectorOpen: function() {
                return template.languageSelectorOpen.get();
            },
            selectedLocationReactiveVar: function() {
                return template.selectedLocation;
            },
            locationHasValueVar: function() {
                return template.locationHasValueVar;
            },
            locationFormvalue: function() {
                return function(location) {
                    return location.id;
                };
            },
            locationLabel: function() {
                return Partup.client.strings.locationToDescription;
            },
            active: function() {
                return template.data.isActiveReactiveVar.get();
            }
        };
    },
    data: function() {
        var template = Template.instance();

        return {
            languages: function() {
                return Languages.find();
            }
        };
    },
    hooks: function() {
        return {
            locationQuery: function() {
                return function(query, sync, async) {
                    Meteor.call('google.cities.autocomplete', query, function(error, locations) {
                        lodash.each(locations, function(loc) {
                            loc.value = Partup.client.strings.locationToDescription(loc);
                        });
                        async(locations);
                    });
                };
            },
        };
    }
});

Template.app_discover_tribes_filter.events({
    'submit [data-form]': function(event, template) {
        event.preventDefault();
    },
    'input [data-search-query]': function(event, template) {
        template.searchQuery.set($(event.currentTarget).val());
    }
});

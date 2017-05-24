import _ from 'lodash';

const sortPartups = (partups, user) => lodash.sortByOrder(partups, partup => {
    let upper_data = lodash.find(partup.upper_data, '_id', user._id)
    return (upper_data && upper_data.new_updates) ? upper_data.new_updates.length : 0
}, ['desc'])
const sortNetworks = networks => lodash.sortByOrder(networks, network => network.name, ['asc'])

Template.DropdownTribes.onCreated(function() {
    var template = this;
    var user = Meteor.user();

    // states & results change every time the dropdown opens, see 'template.DropdownOpen' below
    // because the network array gets filled by two calls, both the loading states need to check if the process is complete
    template.states = {
        loadingUpperpartups: new ReactiveVar(false, (oldValue, newValue) => {
            if (newValue === false && template.states.loadingSupporterpartups.curValue === false) { template.states.loadingNetworks.set(false) }
            else { template.states.loadingNetworks.set(true) }
        }),
        loadingSupporterpartups: new ReactiveVar(false, (oldValue, newValue) => {
            if (newValue === false && template.states.loadingUpperpartups.curValue === false) { template.states.loadingNetworks.set(false) }
            else { template.states.loadingNetworks.set(true) }
        }),
        loadingNetworks: new ReactiveVar(false)
    };
    template.results = {
        upperpartups: new ReactiveVar([]),
        supporterpartups: new ReactiveVar([]),
        networks: new ReactiveVar([])
    };

    // The tribe used to decide which part-ups to load in the extended menu
    template.activeTribe = new ReactiveVar(undefined);
    template.showPartups = new ReactiveVar(false);

    const query = {
        token: Accounts._storedLoginToken(),
        archived: false
    };

    template.dropdownOpen = new ReactiveVar(false, function(a, hasBeenOpened) {
        if (!hasBeenOpened) return;
        
        // (Re)load networks
        template.states.loadingNetworks.set(true);
        HTTP.get('/users/' + user._id + '/networks' + mout.queryString.encode(query), function(error, response) {
            
            let result = response.data
            if (error) {
                return
            }
            template.results.networks.set(
                _.unionBy(template.results.networks.get()
                    , _.map(result.networks || [], network => Partup.client.embed.network(network, result['cfs.images.filerecord'], result.users))
                    , network => network._id))
        });

        // (Re)load upper partups
        template.states.loadingUpperpartups.set(true);
        HTTP.get('/users/' + user._id + '/upperpartups' + mout.queryString.encode(query), function(error, response) {
            template.states.loadingUpperpartups.set(false);
            let result = response.data;
            if (error || !result.partups || result.partups.length === 0) {
                return;
            }

            // Both the HTTP requests obtain the networks the partups belong to so
            // the result is merged with possibly existing networks from the other request below
            template.results.networks.set(
                _.unionBy(template.results.networks.get()
                    , result.networks || []
                    , network => network._id))

            template.results.upperpartups.set(
                _.map(result.partups, partup => Partup.client.embed.partup(partup, result['cfs.images.filerecord'], result.networks, result.users)))
        });

        // (Re)load supporter partups
        template.states.loadingSupporterpartups.set(true);
        HTTP.get('/users/' + user._id + '/supporterpartups' + mout.queryString.encode(query), function(error, response) {
            template.states.loadingSupporterpartups.set(false);
            let result = response.data;
            if (error || !response.data.partups || response.data.partups.length === 0) {
                return;
            }

            template.results.networks.set(
                _.unionBy(template.results.networks.get()
                    , result.networks || []
                    , network => network._id))
            
            template.results.supporterpartups.set(
                _.map(result.partups, partup => Partup.client.embed.partup(partup, result['cfs.images.filerecord'], result.networks, result.users)))
        });
    });

    template.handleXPos = function(event) {
        $(event.currentTarget).parent().find('[data-inner]').css({
            left: (event.offsetX - 30) + 'px',
            display: 'block',
            pointerEvents: 'auto'
        });
    };
});

Template.DropdownTribes.onRendered(function() {
    var template = this
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu=tribes]', function() {ClientDropdowns.partupNavigationSubmenuActive.set(false);});
    Router.onBeforeAction(function(req, res, next) {
        template.dropdownOpen.set(false);
        next();
    });

    var currentWidth = 0;
    template.calculateWidth = function() {
        var width = template.$('[data-toggle-menu]').outerWidth(true);
        if (currentWidth !== width) {
            $('[data-before]').css('width', width - 19);
            currentWidth = width;
        }
    };

    $(window).on('resize', template.calculateWidth);
    template.calculateWidth();
});

Template.DropdownTribes.onDestroyed(function() {
    var template = this;
    ClientDropdowns.removeOutsideDropdownClickHandler(template);
    $(window).off('resize', template.calculateWidth);
});

Template.DropdownTribes.events({
    'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]': Partup.client.scroll.preventScrollPropagation,
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler.bind(null, 'top-level'),
    'mouseenter [data-hover]': function(event, template) {
        var windowWidth = window.innerWidth;
        if (windowWidth < 992) return;

        $('[data-hidehohover]').removeClass('scrolling');
        var tribeId = $(event.currentTarget).data('hover');
        template.showPartups.set(false);
        if (template.activeTribe.curValue !== tribeId) template.activeTribe.set(tribeId);
        template.showPartups.set(true);
    },
    'click [data-hover]': function(event, template) {
        var windowWidth = window.innerWidth;

        if (windowWidth < 992) {
            event.preventDefault();

            $('[data-hidehohover]').removeClass('scrolling');
            var tribeId = $(event.currentTarget).data('hover');
            template.showPartups.set(false);
            if (template.activeTribe.curValue !== tribeId) template.activeTribe.set(tribeId);
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
    // 'scroll [data-hidehohover], DOMMouseScroll [data-hidehohover], mousewheel [data-hidehohover]': function(event, template) {
    //     $(event.currentTarget).addClass('scrolling');
    // },
    // 'mouseenter [data-hohover]': function(event, template) {
    //     $(event.currentTarget).css('z-index', 2);
    //     $(event.currentTarget).find('[data-outer]').on('mousemove', template.handleXPos);
    // },
    // 'mouseleave [data-hohover]': function(event, template) {
    //     $(event.currentTarget).css('z-index', 1);
    //     $(event.currentTarget).find('[data-inner]').css({
    //         display: 'none',
    //         pointerEvents: 'none'
    //     });
    //     $(event.currentTarget).find('[data-outer]').off('mousemove', template.handleXPos);
    // },
});

Template.DropdownTribes.helpers({
    menuOpen: () => Template.instance().dropdownOpen.get(),
    showPartups: () => Template.instance().showPartups.get(),
    currentTribe: () =>  Template.instance().activeTribe.get(),
    currentTribeFull: () => {
        var template = Template.instance();
        var networks = template.results.networks.get();
        var networkId = template.activeTribe.get();
        return lodash.find(networks, {_id: networkId});
    },

    loadingUpperpartups: () => Template.instance().states.loadingUpperpartups.get(),
    loadingSupporterpartups: () => Template.instance().states.loadingSupporterpartups.get(),

    networks: () => sortNetworks(Template.instance().results.networks.get()),
    isMemberOfNetwork: network => network.uppers.find(userId => userId === Meteor.userId()),

    upperPartups: () => {
        let user = Meteor.user()
        if (!user) return []

        let tribeId = Template.instance().activeTribe.get()
        let upperpartups = Template.instance().results.upperpartups.get()

        return sortPartups(_.filter(upperpartups, partup => partup.network_id === tribeId), user)
    },
    supporterPartups: () => {
        let user = Meteor.user()
        if (!user) return []

        let tribeId = Template.instance().activeTribe.get()
        let supporterpartups = Template.instance().results.supporterpartups.get()

        return sortPartups(_.filter(supporterpartups, partup => partup.network_id === tribeId), user)
    },
    newUpdates: function () {
        return _.reduce(_.map(_.filter(
                this.upper_data || [], upperdata => upperdata._id === Meteor.userId())
                , upperdata => upperdata.new_updates.length)
                , (count, n) => count = count + n, null)
    }
});

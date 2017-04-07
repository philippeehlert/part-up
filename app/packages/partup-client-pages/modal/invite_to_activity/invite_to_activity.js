Template.modal_invite_to_activity.onCreated(function () {
    var template = this;
    var user = Meteor.user();
    var partupId = template.data.partupId;
    var activityId = template.data.activityId;
    var PAGING_INCREMENT = 10;

    template.activeTab = new ReactiveVar(1);

    template.userIds = new ReactiveVar([]);
    template.loading = new ReactiveVar(true);
    
    template.networks = new ReactiveVar([]);
    template.selectedNetwork = new ReactiveVar('all', resetPage);
    template.networksLoaded = false;
    
    template.states = {
        loading_infinite_scroll: false,
        paging_end_reached: new ReactiveVar(false)
    };
    template.query = {
        currentQuery: '',
        searchQuery: new ReactiveVar(undefined, function(curQuery, newQuery) {
            currentQuery = newQuery;
            resetPage(curQuery, newQuery);
        })
    };

    // Asign functions to the template so they can be accessed by the helpers & event handlers.
    template.resetPage = resetPage;
    template.submitFilterForm = submitFilterForm;

    template.partupSubscription = template.subscribe('partups.one', partupId, preselectNetwork);
    template.activitiesSubscription = template.subscribe('activities.from_partup', partupId);

    template.callIteration = 0;
    template.page = new ReactiveVar(false, loadSuggestedUsersToPage);

    /* Initializing the template */
    // Set networks for filtering users.
    setNetworks();
    // This will trigger a change in the ReactiveVar which in turn will run the assigned function and load the user tiles.
    template.page.set(0);

    function resetPage() {
            template.userIds.set([]);
            template.states.paging_end_reached.set(false);
            template.states.loading_infinite_scroll = false;
            _.defer(function() {template.page.set(0)});
    };
    function submitFilterForm() {
        Meteor.defer(function () {
            var form = template.find('form#suggestionsQuery');
            $(form).submit();
        });
    };
    function preselectNetwork() {
        var partup = Partups.findOne(partupId);
        if (!partup) return;
        var networks = template.networks.get();
        if (!networks || !networks.length) return;
        var network = lodash.find(networks, {_id: partup.network_id || undefined});
        template.selectedNetwork.set(network ? network.slug : 'all');
    };
    function setNetworks() {
        var query = {
            token: Accounts._storedLoginToken(),
            archived: false
        };
        HTTP.get('/users/' + user._id + '/networks' + mout.queryString.encode(query), function (error, response) {
            
            if (error || !response.data.networks || response.data.networks.length === 0) return;

            var result = response.data;

            template.networks.set(result.networks.map(function (network) {
                Partup.client.embed.network(network, result['cfs.images.filerecord'], result.users);
                return network;
            }).sort(Partup.client.sort.alphabeticallyASC.bind(null, 'name')));

            preselectNetwork();
        });
    };
    function loadSuggestedUsersToPage(prevPage, page) {

        var query = template.query.searchQuery.get() || '';
        var netw = template.selectedNetwork.curValue === 'all' ? undefined : template.selectedNetwork.curValue;
        var options = {
            query: query,
            limit: PAGING_INCREMENT,
            skip: page * PAGING_INCREMENT,
            network: template.activeTab.curValue === 3 ? undefined : netw,
            invited_in_activity: template.activeTab.curValue === 3 ? activityId : undefined
        };

        template.loading.set(true);
        template.callIteration++;
        var currentCallIteration = template.callIteration;
        Meteor.call('activities.user_suggestions', activityId, options, function(error, userIds) {
            if (query !== template.query.currentQuery | (currentCallIteration !== template.callIteration)) return;
            template.loading.set(false);

            if (error) {
                return Partup.client.notify.error(TAPi18n.__('base-errors' + error.reason));
            }
            if (!userIds || userIds.length === 0) {
                template.states.loading_infinite_scroll = false;
                template.states.paging_end_reached.set(true);
                return;
            }

            template.states.paging_end_reached.set(userIds.length < PAGING_INCREMENT);

            var existingUserIds = template.userIds.get();
            var newUserIds = existingUserIds.concat(userIds);
            template.userIds.set(newUserIds);

            template.states.loading_infinite_scroll = false;
        });
    };
});

Template.modal_invite_to_activity.onRendered(function () {
    var template = this;
    Partup.client.scroll.infinite({
        template: template,
        element: template.find('[data-infinitescroll-container]'),
        offset: 800
    }, function() {
        if (!(template.networksLoaded && template.partupSubscription.ready())) return;
        if (template.states.loading_infinite_scroll || template.states.paging_end_reached.curValue) { return; }
        template.page.set(template.page.curValue + 1);
    });
})

Template.modal_invite_to_activity.helpers({
    data: function () {
        var template = Template.instance();
        return {
            partupId: function () {
                return template.data.partupId;
            },
            activityId: function () {
                return template.data.activityId;
            },
            suggestionIds: function () {
                return template.userIds.get();
            },
            textsearch: function () {
                return template.query.searchQuery.get() || '';
            },
            userTribes: function () {
                return template.networks.get();
            },
            partup: function () {
                return Partups.findOne(template.data.partupId);
            }
        };
    },
    state: function () {
        var template = Template.instance();
        return {
            loading: function () {
                return template.loading.get();
            }
        };
    },
    onToggleTab: function () {
        var template = Template.instance();
        return function (newActiveTab) {
            template.resetPage();
            template.activeTab.set(newActiveTab);
            template.query.searchQuery.set(undefined);
        }
    }
});

/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_invite_to_activity.events({
    'click [data-closepage]': function (event, template) {
        event.preventDefault();
        var partupId = template.data.partupId;
        var partup = Partups.findOne({ _id: partupId });

        Intent.return('partup-activity-invite', {
            fallback_route: {
                name: 'partup',
                params: {
                    slug: partup.slug
                }
            }
        });
    },
    'change [data-filter-tribe]': function (event, template) {
        template.selectedNetwork.set(event.currentTarget.value);
        template.submitFilterForm();
    },
    'submit form#suggestionsQuery': function (event, template) {
        event.preventDefault();
        var form = event.currentTarget;
        template.query.searchQuery.set(form.elements.search_query.value);
    },
    'click [data-reset-search-query-input]': function (event, template) {
        event.preventDefault();
        $('[data-search-query-input]').val('');
        template.submitFilterForm();
    },
    'keyup [data-search-query-input]': function (e, template) {
        template.submitFilterForm();
    }
});

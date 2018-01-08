Template.modal_invite_to_partup.onCreated(function() {
  let template = this;
  let partupId = template.data.partupId;
  let PAGING_INCREMENT = 10;

  template.activeTab = new ReactiveVar(1);

  template.userIds = new ReactiveVar([]);
  template.networks = new ReactiveVar([]);

  template.loading = new ReactiveVar(false);
  template.page = new ReactiveVar(0);
  template.selectedNetwork = new ReactiveVar('all', resetPage);
  template.searchQuery = new ReactiveVar(undefined, resetPage);

  function resetPage() {
    template.page.set(0);
    template.userIds.set([]);
    template.states.paging_end_reached.set(false);
    template.states.loading_infinite_scroll = false;
  }

  template.onToggleTab = function(newActiveTab) {
    resetPage();
    template.activeTab.set(newActiveTab);
    template.searchQuery.set(undefined);
  };

  template.loaded = function() {
    return template.networksLoaded && template.partupSubscription.ready();
  };

  template.states = {
    loading_infinite_scroll: false,
    paging_end_reached: new ReactiveVar(false),
  };

  let preselectNetwork = function() {
    let partup = Partups.findOne(template.data.partupId);
    if (!partup) return;
    let networks = template.networks.get();
    if (!networks || !networks.length) return;
    let network = lodash.find(networks, {
      _id: partup.network_id || undefined,
    });
    template.selectedNetwork.set(network ? network.slug : 'all');
  };

  template.partupSubscription = template.subscribe(
    'partups.one',
    template.data.partupId,
    preselectNetwork
  );

  let userId = Meteor.userId();
  let query = {
    token: Accounts._storedLoginToken(),
    archived: false,
  };

  template.networksLoaded = false;
  HTTP.get(
    '/users/' + userId + '/networks' + mout.queryString.encode(query),
    function(error, response) {
      template.networksLoaded = true;
      if (
        error ||
        !response.data.networks ||
        response.data.networks.length === 0
      ) {
        return;
      }

      let result = response.data;

      template.networks.set(
        result.networks
          .map(function(network) {
            Partup.client.embed.network(
              network,
              result['cfs.images.filerecord'],
              result.users
            );

            return network;
          })
          .sort(Partup.client.sort.alphabeticallyASC.bind(null, 'name'))
      );

      preselectNetwork();
    }
  );

  // Submit filter form
  template.submitFilterForm = function() {
    Meteor.defer(function() {
      let form = template.find('form#suggestionsQuery');
      $(form).submit();
    });
  };

  let load = function(partup_id, page, query, network, tab) {
    if (!template.loaded()) return;

    if (template.loading.curValue) return;
    template.loading.set(true);

    if (page === 0) template.userIds.set([]);
    let netw = network === 'all' ? undefined : network;
    let options = {
      query: query || '',
      limit: PAGING_INCREMENT,
      skip: page * PAGING_INCREMENT,
      network: tab === 3 ? undefined : netw,
      invited_in_partup: tab === 3 ? partup_id : undefined,
    };

    Meteor.call('partups.user_suggestions', partup_id, options, function(
      error,
      userIds
    ) {
      template.loading.set(false);

      if (error) {
        return Partup.client.notify.error(
          TAPi18n.__('base-errors-' + error.reason)
        );
      }

      if (!userIds || userIds.length === 0) {
        template.states.loading_infinite_scroll = false;
        template.states.paging_end_reached.set(true);
        return;
      }

      template.states.paging_end_reached.set(userIds.length < PAGING_INCREMENT);

      let existingUserIds = template.userIds.get();
      let newUserIds = existingUserIds.concat(userIds);
      template.userIds.set(newUserIds);
      template.states.loading_infinite_scroll = false;
    });
  };
  template.autorun(function() {
    let tab = template.activeTab.get();
    let page = template.page.get();
    let network = template.selectedNetwork.get();
    let query = template.searchQuery.get();
    // if email tab is active, do nothing
    if ([2].indexOf(tab) > -1) return;
    load(partupId, page, query, network, tab);
  });
});

Template.modal_invite_to_partup.onRendered(function() {
  let template = this;
  Partup.client.scroll.infinite(
    {
      template: template,
      element: template.find('[data-infinitescroll-container]'),
      offset: 800,
    },
    function() {
      if (!template.loaded()) return;
      if (
        template.states.loading_infinite_scroll ||
        template.states.paging_end_reached.curValue
      ) {
        return;
      }
      template.page.set(template.page.curValue + 1);
    }
  );
});

Template.modal_invite_to_partup.helpers({
  data: function() {
    let template = Template.instance();
    return {
      suggestionIds: function() {
        return template.userIds.get();
      },
      textsearch: function() {
        return template.searchQuery.get() || '';
      },
      partupId: function() {
        return template.data.partupId;
      },
      userTribes: function() {
        return template.networks.get();
      },
      partup: function() {
        return Partups.findOne(template.data.partupId);
      },
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      loading: function() {
        return template.loading.get();
      },
    };
  },
  hooks: function() {
    let template = Template.instance();
    return {
      onToggleTab: function() {
        return template.onToggleTab;
      },
    };
  },
});

/** ***********************************************************/
/* Page events */
/** ***********************************************************/
Template.modal_invite_to_partup.events({
  'click [data-closepage]': function(event, template) {
    event.preventDefault();
    let partupId = template.data.partupId;
    let partup = Partups.findOne({ _id: partupId });

    Intent.return('partup', {
      fallback_route: {
        name: 'partup',
        params: {
          slug: partup.slug,
        },
      },
    });
  },
  'change [data-filter-tribe]': function(event, template) {
    template.selectedNetwork.set(event.currentTarget.value);
    template.submitFilterForm();
  },
  'submit form#suggestionsQuery': function(event, template) {
    event.preventDefault();
    let form = event.currentTarget;
    template.searchQuery.set(form.elements.search_query.value);
  },
  'click [data-reset-search-query-input]': function(event, template) {
    event.preventDefault();
    $('[data-search-query-input]').val('');
    template.submitFilterForm();
  },
  'keyup [data-search-query-input]': function(e, template) {
    template.submitFilterForm();
  },
});

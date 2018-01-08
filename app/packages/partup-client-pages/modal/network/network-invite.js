Template.modal_network_invite.onCreated(function() {
  let template = this;
  let userId = Meteor.userId();
  let networkSlug = template.data.networkSlug;
  let PAGING_INCREMENT = 10;
  template.activeTab = new ReactiveVar(1);

  template.userIds = new ReactiveVar([]);

  template.loading = new ReactiveVar(false);
  template.page = new ReactiveVar(0);
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
    return template.networkSubscription.ready();
  };

  template.states = {
    loading_infinite_scroll: false,
    paging_end_reached: new ReactiveVar(false),
  };

  let network;
  let onNetworkLoad = function() {
    network = Networks.findOne({ slug: networkSlug });
    if (!network || network.isClosedForUpper(userId)) {
      Router.pageNotFound();
    }
  };

  template.networkSubscription = template.subscribe(
    'networks.one',
    networkSlug,
    onNetworkLoad
  );

  // Submit filter form
  template.submitFilterForm = function() {
    Meteor.defer(function() {
      let form = template.find('form#suggestionsQuery');
      $(form).submit();
    });
  };

  let load = function(network_slug, page, query, tab) {
    if (!template.loaded()) return;

    if (template.loading.curValue) return;
    template.loading.set(true);

    if (page === 0) template.userIds.set([]);
    let options = {
      query: query || '',
      limit: PAGING_INCREMENT,
      skip: page * PAGING_INCREMENT,
      invited_in_network: tab === 3 ? network._id : undefined,
    };

    Meteor.call('networks.user_suggestions', network_slug, options, function(
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
    let query = template.searchQuery.get();
    // if email tab is active, do nothing
    if ([2].indexOf(tab) > -1) return;
    load(networkSlug, page, query, tab);
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

Template.modal_network_invite.helpers({
  data: function() {
    let template = Template.instance();
    return {
      suggestionIds: function() {
        return template.userIds.get();
      },
      textsearch: function() {
        return template.searchQuery.get() || '';
      },
      networkSlug: function() {
        return template.data.networkSlug;
      },
      network: function() {
        return Networks.findOne({ slug: template.data.networkSlug });
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

Template.modal_network_invite.events({
  'click [data-closepage]': function(event, template) {
    event.preventDefault();

    let network = Networks.findOne({ slug: template.data.networkSlug });

    Intent.return('network', {
      fallback_route: {
        name: 'network-uppers',
        params: {
          slug: network.slug,
        },
      },
    });
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

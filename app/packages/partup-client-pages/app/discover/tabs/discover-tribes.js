Template.app_discover_tribes.onCreated(function() {
  let template = this;
  let PAGING_INCREMENT = 10;

  template.dropdownActive = new ReactiveVar(false);

  template.sorting = new ReactiveVar({ value: 'popular' }, function(a, b) {
    Partup.client.discover.current_tribe_query.sort =
      (b && b.value) || undefined;
    for (key in Partup.client.discover.DEFAULT_TRIBE_QUERY) {
      let fieldValue = Partup.client.discover.current_tribe_query[key];
      let defaultFieldValue = Partup.client.discover.DEFAULT_TRIBE_QUERY[key];

      Partup.client.discover.tribe_query.set(
        key,
        fieldValue || defaultFieldValue
      );
    }
  });

  template.networks = new ReactiveVar([]);
  // Current query placeholder
  template.query;

  // States such as loading states
  template.states = {
    loading_infinite_scroll: false,
    paging_end_reached: new ReactiveVar(false),
    count_loading: new ReactiveVar(false),
    loaded: new ReactiveVar(false),
  };

  // Partup result count
  template.count = new ReactiveVar();

  template.tribesXMLHttpRequest = null;
  template.page = new ReactiveVar(undefined, function(previousPage, page) {
    template.query = Partup.client.discover.composeTribeQueryObject();

    // Cancel possibly ongoing request
    if (template.tribesXMLHttpRequest) {
      template.tribesXMLHttpRequest.abort();
      template.tribesXMLHttpRequest = null;
    }

    let query = mout.object.deepFillIn({}, template.query);
    query.limit = PAGING_INCREMENT;
    query.skip = page * PAGING_INCREMENT;
    query.userId = Meteor.userId();
    query.token = Accounts._storedLoginToken();

    template.tribesXMLHttpRequest = null;

    HTTP.get(
      '/networks/discover' + mout.queryString.encode(query),
      {
        beforeSend: function(_request) {
          template.tribesXMLHttpRequest = _request;
        },
      },
      function(error, response) {
        template.tribesXMLHttpRequest = null;

        if (
          error ||
          !response.data.networks ||
          response.data.networks.length === 0
        ) {
          template.states.loading_infinite_scroll = false;
          template.states.paging_end_reached.set(true);
          return;
        }

        //  response.data contains all discovered part-ups with all relevant users.
        let result = response.data;
        template.states.paging_end_reached.set(
          result.networks.length < PAGING_INCREMENT
        );
        let tiles = result.networks.map(function(network) {
          Partup.client.embed.network(
            network,
            result['cfs.images.filerecord'],
            result.users
          );
          return network;
        });
        let curNetworks = template.networks.get();
        let newNetworks = curNetworks.concat(tiles);
        template.networks.set(newNetworks);
        template.states.loaded.set(true);
      }
    );
  });

  template.countXMLHttpRequest = null;
  template.autorun(function() {
    if (template.countXMLHttpRequest) {
      template.countXMLHttpRequest.abort();
      template.countXMLHttpRequest = null;
    }

    template.query = Partup.client.discover.composeTribeQueryObject();

    let query = mout.object.deepFillIn({}, template.query);
    query.userId = Meteor.userId();
    query.token = Accounts._storedLoginToken();

    template.states.paging_end_reached.set(false);
    template.page.set(0);
    template.networks.set([]);

    template.states.count_loading.set(true);
    HTTP.get(
      '/networks/discover/count' + mout.queryString.encode(query),
      {
        beforeSend: function(request) {
          template.countXMLHttpRequest = request;
        },
      },
      function(error, response) {
        template.countXMLHttpRequest = null;
        template.states.count_loading.set(false);
        if (error || !response || !mout.lang.isString(response.content)) {
          return;
        }

        let content = JSON.parse(response.content);
        template.count.set(content.count);
      }
    );
  });
});

Template.app_discover_tribes.onRendered(function() {
  let template = this;
  template.page.set(0);

  Partup.client.scroll.infinite(
    {
      template: template,
      element: $('[data-infinitescroll-container ]')[0],
      offset: 200,
    },
    function() {
      if (
        template.states.loading_infinite_scroll ||
        template.states.paging_end_reached.curValue
      ) {
        return;
      }
      let nextPage = template.page.get() + 1;
      template.page.set(nextPage);
    }
  );
});

Template.app_discover_tribes.events({
  'click [data-toggle-discover-menu]': function(event, template) {
    event.preventDefault();

    template.dropdownActive.set(!template.dropdownActive.curValue);
  },
});

Template.app_discover_tribes.helpers({
  data: function() {
    let template = Template.instance();
    return {
      networks: function() {
        return template.networks.get();
      },
    };
  },
  state: function() {
    let template = Template.instance();

    return {
      dropdownActiveReactiveVar: function() {
        return template.dropdownActive;
      },
      dropdownActive: function() {
        return template.dropdownActive.get();
      },
    };
  },
  loaded: function() {
    return Template.instance().states.loaded.get();
  },
  endReached: function() {
    return Template.instance().states.paging_end_reached.get();
  },
  count: function() {
    return Template.instance().count.get();
  },
  countLoading: function() {
    return Template.instance().states.count_loading.get();
  },
  sortReactiveVar: function() {
    return Template.instance().sorting;
  },
});

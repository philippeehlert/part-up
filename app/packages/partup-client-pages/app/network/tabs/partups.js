let PAGING_INCREMENT = 32;
Template.app_network_partups.onCreated(function() {
  let template = this;
  template.getArchivedPartups = false;

  // Partup result count
  template.partupCount = new ReactiveVar();

  // States such as loading states
  template.states = {
    loadingInfiniteScroll: false,
    pagingEndReached: new ReactiveVar(false),
    partupCountLoading: new ReactiveVar(true),
  };

  // Column layout
  template.columnTilesLayout = new Partup.client.constructors.ColumnTilesLayout(
    {
      // This function will be called for each tile
      calculateApproximateTileHeight: function(tileData, columnWidth) {
        // The goal of this formula is to approach
        // the expected height of a tile as best
        // as possible, synchronously,
        // using the given partup object
        let BASE_HEIGHT = 308;
        let MARGIN = 18;

        let _partup = tileData.partup;

        let NAME_PADDING = 40;
        let NAMe_LINEHEIGHT = 22;
        let nameCharsPerLine = 0.099 * (columnWidth - NAME_PADDING);
        let nameLines = Math.ceil(_partup.name.length / nameCharsPerLine);
        let name = nameLines * NAMe_LINEHEIGHT;

        let DESCRIPTION_PADDING = 40;
        let DESCRIPTION_LINEHEIGHT = 22;
        let descriptionCharsPerLine =
          0.145 * (columnWidth - DESCRIPTION_PADDING);
        let descriptionLines = Math.ceil(
          _partup.description.length / descriptionCharsPerLine
        );
        let description = descriptionLines * DESCRIPTION_LINEHEIGHT;

        let tribe = _partup.network ? 47 : 0;

        return BASE_HEIGHT + MARGIN + name + description + tribe;
      },
      columnMinWidth: 277,
    }
  );

  template.initialize = function(filter) {
    template.getArchivedPartups = filter === 'archived' ? true : false;

    let query = {};
    query.userId = Meteor.userId();
    query.token = Accounts._storedLoginToken();
    query.archived = template.getArchivedPartups;
    query.textSearch = template.searchQuery.get();

    // Get count
    template.states.partupCountLoading.set(true);
    HTTP.get(
      '/networks/' +
        template.data.networkSlug +
        '/partups/count' +
        mout.queryString.encode(query),
      function(error, response) {
        if (query.archived !== template.getArchivedPartups) return;

        template.states.partupCountLoading.set(false);
        if (error || !response || !mout.lang.isString(response.content)) {
          return;
        }
        let content = JSON.parse(response.content);
        template.partupCount.set(content.count);
      }
    );

    // When the page changes due to infinite scroll
    template.page.set(0);
  };

  // When the page changes due to infinite scroll
  template.page = new ReactiveVar(false, function(previousPage, page) {
    // Add some parameters to the query
    let query = {};
    query.limit = PAGING_INCREMENT;
    query.skip = page * PAGING_INCREMENT;
    query.userId = Meteor.userId();
    query.archived = template.getArchivedPartups;
    query.textSearch = template.searchQuery.get();

    // Update state(s)
    template.states.loadingInfiniteScroll = true;

    // Call the API for data
    HTTP.get(
      '/networks/' +
        template.data.networkSlug +
        '/partups' +
        mout.queryString.encode(query),
      {
        headers: {
          Authorization: 'Bearer ' + Accounts._storedLoginToken(),
        },
      },
      function(error, response) {
        if (query.archived !== template.getArchivedPartups) return;

        if (
          error ||
          !response.data.partups ||
          response.data.partups.length === 0
        ) {
          template.states.loadingInfiniteScroll = false;
          template.states.pagingEndReached.set(true);
          return;
        }

        let result = response.data;
        template.states.pagingEndReached.set(
          result.partups.length < PAGING_INCREMENT
        );

        let tiles = result.partups.map(function(partup) {
          Partup.client.embed.partup(
            partup,
            result['cfs.images.filerecord'],
            result.networks,
            result.users
          );

          return {
            partup: partup,
            HIDE_NETWORKTILE: true,
            CONTEXT: 'tribe',
          };
        });
        // Add tiles to the column layout
        template.columnTilesLayout.addTiles(tiles, function callback() {
          template.states.loadingInfiniteScroll = false;
        });
      }
    );
  });

  let switchFilter = function(filter) {
    var filter = filter || template.filter.get();
    template.columnTilesLayout.clear(function() {
      template.initialize(filter);
    });
  };

  template.filter = new ReactiveVar('active', function(a, b) {
    if (a !== b) switchFilter(b);
  });

  let routeQuery = Router.current().params.query.tag || '';

  template.searchQuery = new ReactiveVar(routeQuery, function(a, b) {
    if (a !== b) switchFilter();
  });

  let setSearchQuery = function(query) {
    template.searchQuery.set(query);
  };
  template.throttledSetSearchQuery = _.throttle(setSearchQuery, 500, {
    trailing: true,
  });

  template.reactiveExpander = new ReactiveVar(false);
});

Template.app_network_partups.onRendered(function() {
  let template = this;

  if (template.searchQuery.get()) {
    template.reactiveExpander.set(true);

    Meteor.defer(function() {
      $('[data-search]').val(template.searchQuery.get());
    });
  }

  // Infinite scroll
  Partup.client.scroll.infinite(
    {
      template: template,
      element: template.find('[data-infinitescroll-container]'),
      offset: 1500,
    },
    function() {
      if (
        template.states.loadingInfiniteScroll ||
        template.states.pagingEndReached.curValue
      ) {
        return;
      }

      let nextPage = template.page.get() + 1;
      template.page.set(nextPage);
    }
  );

  template.initialize('active');

  template.blurSearchInput = function() {
    template.$('[data-search]').blur();
  };
  $(window).on('blur', template.blurSearchInput);
});
Template.app_network_partups.onDestroyed(function() {
  let template = this;
  $(window).off('blur', template.blurSearchInput);
});

Template.app_network_partups.events({
  'submit [data-nosubmit]': function(event, template) {
    event.preventDefault();
  },
  'click [data-flexible-center]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .parent()
      .addClass('start');
    $('[data-search]').focus();
    _.defer(function() {
      $(event.currentTarget)
        .parent()
        .addClass('active');
    });
  },
  'click [data-clear]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    $('[data-search]').val('');
    _.defer(function() {
      template.throttledSetSearchQuery('');
      $('[data-search]').blur();
    });
  },
  'input [data-search]': function(event, template) {
    template.throttledSetSearchQuery(event.currentTarget.value);
  },
  'focus [data-search]': function(event, template) {
    $(event.currentTarget)
      .parent()
      .addClass('start');
    _.defer(function() {
      template.focussed = true;
      $(event.currentTarget)
        .parent()
        .addClass('active');
    });
  },
  'blur [data-search]': function(event, template) {
    if (!$(event.target).val()) {
      template.focussed = false;
      $('[data-flexible-center]')
        .parent()
        .removeClass('active');
    }
  },
  'transitionend [data-flexible-center]': function(event, template) {
    $(event.currentTarget)
      .parent()
      .removeClass('start');
  },
});

Template.app_network_partups.helpers({
  configs: function() {
    let template = Template.instance();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    return {
      networkStartPartupTileSettings: function() {
        if (network.archived_at) return undefined;
        return {
          template: 'NetworkStartPartupTile',
          data: {
            networkSlug: template.data.networkSlug,
          },
        };
      },
      focusOnSearchField: function() {
        return function() {
          template.find('[data-search]').focus();
        };
      },
      reactiveExpander: function() {
        return template.reactiveExpander;
      },
    };
  },
  data: function() {
    let template = Template.instance();
    let self = this;
    return {
      columnTilesLayout: function() {
        return template.columnTilesLayout;
      },
      partupCount: function() {
        return template.partupCount.get();
      },
      network: function() {
        return Networks.findOne({ slug: self.networkSlug });
      },
      filterReactiveVar: function() {
        return template.filter;
      },
    };
  },
  state: function() {
    let template = Template.instance();
    let states = template.states;
    return {
      endReached: function() {
        return states.pagingEndReached.get();
      },
      countLoading: function() {
        return states.partupCountLoading.get();
      },
      selectedFilter: function() {
        return template.filter.get();
      },
    };
  },
  translations: function() {
    let template = Template.instance();
    return {
      partupsLoading: function(selection) {
        return TAPi18n.__(
          'pages-app-network-partups-' + selection + '-loading'
        );
      },
      partupsCount: function() {
        let count = template.partupCount.get();
        let selection = template.filter.get();
        return TAPi18n.__('pages-app-network-partups-' + selection + '-count', {
          count: count,
        });
      },
      partupsNone: function(selection) {
        return TAPi18n.__('pages-app-network-partups-' + selection + '-none');
      },
    };
  },
});

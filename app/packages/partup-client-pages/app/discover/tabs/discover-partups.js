let PAGING_INCREMENT = 25;
Template.app_discover_partups.onCreated(function() {
  let template = this;

  template.dropdownActive = new ReactiveVar(false);

  template.sorting = new ReactiveVar(undefined, function(a, b) {
    Partup.client.discover.current_query.sort = (b && b.value) || undefined;
    for (key in Partup.client.discover.DEFAULT_QUERY) {
      let fieldValue = Partup.client.discover.current_query[key];
      let defaultFieldValue = Partup.client.discover.DEFAULT_QUERY[key];

      Partup.client.discover.query.set(key, fieldValue || defaultFieldValue);
    }
  });

  // States such as loading states
  template.states = {
    loading_infinite_scroll: false,
    paging_end_reached: new ReactiveVar(false),
    count_loading: new ReactiveVar(false),
    loaded: new ReactiveVar(false),
  };

  // Partup result count
  template.count = new ReactiveVar();

  // Column layout
  template.columnTilesLayout = new Partup.client.constructors.ColumnTilesLayout(
    {
      columnMinWidth: 277,
      maxColumns: 3,
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
    }
  );
});

Template.app_discover_partups.onRendered(function() {
  let template = this;

  // Current query placeholder
  template.query;

  // When the page changes due to infinite scroll
  template.partupsXMLHttpRequest = null;
  template.page = new ReactiveVar(false, function(previousPage, page) {
    // Cancel possibly ongoing request
    if (template.partupsXMLHttpRequest) {
      template.partupsXMLHttpRequest.abort();
      template.partupsXMLHttpRequest = null;
    }

    // Add some parameters to the query
    let query = mout.object.deepFillIn({}, template.query);
    query.limit = PAGING_INCREMENT;
    query.skip = page * PAGING_INCREMENT;
    query.userId = Meteor.userId();
    query.token = Accounts._storedLoginToken();

    // Update state(s)
    template.states.loading_infinite_scroll = true;

    // Call the API for data
    HTTP.get(
      '/partups/discover' + mout.queryString.encode(query),
      {
        beforeSend: function(_request) {
          template.partupsXMLHttpRequest = _request;
        },
      },
      function(error, response) {
        template.partupsXMLHttpRequest = null;

        if (
          error ||
          !response.data.partups ||
          response.data.partups.length === 0
        ) {
          template.states.loading_infinite_scroll = false;
          template.states.paging_end_reached.set(true);
          return;
        }

        //  response.data contains all discovered part-ups with all relevant users.
        let result = response.data;
        template.states.paging_end_reached.set(
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
          };
        });

        // Add tiles to the column layout
        template.columnTilesLayout.addTiles(tiles, function callback() {
          template.states.loading_infinite_scroll = false;
        });

        template.states.loaded.set(true);
      }
    );
  });

  // When the query changes
  template.countXMLHttpRequest = null;
  template.autorun(function() {
    if (template.countXMLHttpRequest) {
      template.countXMLHttpRequest.abort();
      template.countXMLHttpRequest = null;
    }

    template.query = Partup.client.discover.composeQueryObject();

    let query = mout.object.deepFillIn({}, template.query);
    query.userId = Meteor.userId();
    query.token = Accounts._storedLoginToken();

    template.states.paging_end_reached.set(false);
    template.page.set(0);
    template.columnTilesLayout.clear();

    template.states.count_loading.set(true);
    HTTP.get(
      '/partups/discover/count' + mout.queryString.encode(query),
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
  // Infinite scroll
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

Template.app_discover_partups.events({
  'click [data-toggle-discover-menu]': function(event, template) {
    event.preventDefault();

    template.dropdownActive.set(!template.dropdownActive.curValue);
  },
});

Template.app_discover_partups.helpers({
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
  columnTilesLayout: function() {
    return Template.instance().columnTilesLayout;
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

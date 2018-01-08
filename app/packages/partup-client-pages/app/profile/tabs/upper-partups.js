let PAGING_INCREMENT = 32;
Template.app_profile_upper_partups.onCreated(function() {
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
    // Get count
    template.states.partupCountLoading.set(true);
    HTTP.get(
      '/users/' +
        template.data.profileId +
        '/upperpartups/count' +
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
    query.userId = Meteor.userId();
    query.token = Accounts._storedLoginToken();
    query.skip = page * PAGING_INCREMENT;
    query.archived = template.getArchivedPartups;

    // Update state(s)
    template.states.loadingInfiniteScroll = true;

    // Call the API for data
    HTTP.get(
      '/users/' +
        template.data.profileId +
        '/upperpartups' +
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
    template.columnTilesLayout.clear(function() {
      template.initialize(filter);
    });
  };

  template.filter = new ReactiveVar('active', function(a, b) {
    if (a !== b) switchFilter(b);
  });

  template.initialize('active');
});

Template.app_profile_upper_partups.onRendered(function() {
  let template = this;

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
});

Template.app_profile_upper_partups.helpers({
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
      firstname: function() {
        let user = Meteor.users.findOne(self.profileId);
        return User(user).getFirstname();
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
          'pages-app-profile-upper-partups-' + selection + '-loading'
        );
      },
      partupsPrefix: function(selection, name) {
        return TAPi18n.__(
          'pages-app-profile-upper-partups-' + selection + '-prefix',
          {
            name: name,
          }
        );
      },
      partupsCount: function(selection, count) {
        return TAPi18n.__(
          'pages-app-profile-upper-partups-' + selection + '-count',
          {
            count: count,
          }
        );
      },
      partupsNone: function(selection, name) {
        return TAPi18n.__(
          'pages-app-profile-upper-partups-' + selection + '-none',
          {
            name: name,
          }
        );
      },
    };
  },
});

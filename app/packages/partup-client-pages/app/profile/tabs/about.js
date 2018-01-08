Template.app_profile_about.onCreated(function() {
  let template = this;
  template.loading = new ReactiveVar(true);

  // Column layout
  template.columnTilesLayout = new Partup.client.constructors.ColumnTilesLayout(
    {
      // Initial amount of columns
      columnMinWidth: 400,
      maxColumns: 2,

      // This function will be called for each tile
      calculateApproximateTileHeight: function(tileData, columnWidth) {
        // The goal of this formula is to approach
        // the expected height of a tile as best
        // as possible, synchronously,
        // using the given partup object
        return 1000;
      },
    }
  );

  let profileId = template.data.profileId;

  template.subscribe('tiles.profile', profileId, {
    onReady: function() {
      let tiles = Tiles.find({ upper_id: profileId }).fetch();
      let user = Meteor.users.findOne({ _id: profileId });
      let displayTiles = [];

      let meurs = user.profile.meurs || false;

      let profileIsCurrentUser = !!(Meteor.userId() === profileId);
      let profileHasResults = !!(
        meurs &&
        meurs.results &&
        meurs.results.length &&
        meurs.fetched_results
      );
      let profilehasMediaTiles = !!(tiles && tiles.length);

      if (!profileHasResults && profileIsCurrentUser) {
        displayTiles = displayTiles.concat([
          {
            type: 'result',
            profileId,
          },
        ]);
      }

      if (!profilehasMediaTiles && profileIsCurrentUser) {
        displayTiles = displayTiles.concat([
          {
            type: 'image',
            placeholder: true,
          },
        ]);
      }

      if (profileHasResults) {
        displayTiles = displayTiles.concat([
          {
            type: 'result',
            results: meurs,
            profileId,
          },
        ]);
      }

      displayTiles = displayTiles.concat(tiles || []);

      template.columnTilesLayout.addTiles(displayTiles, function() {
        template.loading.set(false);
      });
    },
  });
});

Template.app_profile_about.helpers({
  data: function() {
    let template = Template.instance();
    let profileId = this.profileId;

    return {
      columnTilesLayout: function() {
        return template.columnTilesLayout;
      },
      firstname: function() {
        let user = Meteor.users.findOne(profileId);
        return User(user).getFirstname();
      },
      profileIsCurrentUser: function() {
        return profileId === Meteor.userId();
      },
      loading: function() {
        return template.loading.get();
      },
    };
  },
  translations: function() {
    let profileId = this.profileId;
    let user = Meteor.users.findOne(profileId);

    return {
      firstname: function() {
        return TAPi18n.__('pages-app-profile-about-name', {
          name: User(user).getFirstname(),
        });
      },
    };
  },
});

Template.app_profile_about.events({
  'click [data-create-tile]': function(event, template) {
    event.preventDefault();
    let type = $(event.currentTarget)
      .closest('[data-create-tile]')
      .data('create-tile');
    Partup.client.popup.open(
      {
        id: 'new-' + type,
      },
      function(result) {
        template.refresh();
      }
    );
  },
  'click [data-delete]': function(event, template) {
    event.preventDefault();
    let tile = this;
    let tileId = tile._id;
    Partup.client.prompt.confirm({
      title: TAPi18n.__('pages-app-profile-about-tile-prompt-title'),
      message: TAPi18n.__('pages-app-profile-about-tile-prompt-message'),
      onConfirm: function() {
        Meteor.call('tiles.remove', tileId, function(error, result) {
          if (error) {
            Partup.client.notify.error(TAPi18n.__(error));
            return;
          }
          Partup.client.notify.success('Tile removed');
          template.refresh();
        });
      },
    });
  },
});

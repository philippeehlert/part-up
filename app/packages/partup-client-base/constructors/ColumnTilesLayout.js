/**
 * Constructor for the column tiles layout
 *
 * @class ColumnTilesLayout
 * @memberof Partup.client
 */
Partup.client.constructors.ColumnTilesLayout = function(options) {
  options = options || {};

  if (!mout.lang.isFunction(options.calculateApproximateTileHeight)) {
    throw new Error(
      'ColumnTilesLayout: options.calculateApproximateTileHeight() not found.'
    );
  }

  let _columnMinWidth = options.columnMinWidth || 300;
  let _maxColumns = options.maxColumns || 4;
  let C = this;
  let _options = {
    calculateApproximateTileHeight: options.calculateApproximateTileHeight,
  };
  let _tiles = [];
  let _columnElements = [];

  let initialColumns = [];
  C.initialize = function(template) {
    if (!template) {
      throw new Error(
        'ColumnTilesLayout: \'template\' is \'undefined\' not found.'
      );
    }

    C._template = template;

    _options.columns = getAmountOfColumnsThatFitInElement(
      '[data-this-is-the-columns-layout]',
      _columnMinWidth,
      _maxColumns
    );

    _.times(_options.columns, function() {
      initialColumns.push([]);
    });

    C.columns = new ReactiveVar(initialColumns);

    C._template.autorun(function() {
      let screenWidth = Partup.client.screen.size.get('width');
      let columns = getAmountOfColumnsThatFitInElement(
        '[data-this-is-the-columns-layout]',
        _columnMinWidth,
        _maxColumns
      );

      if (columns !== C.columns.curValue.length) {
        C.setColumns(columns);
      }
    });
    C.initialized.set(true);

    C._onInitCallbacks.forEach(function(args) {
      C.addTiles(args[0], args[1]);
    });

    C._onInitCallbacks = [];
  };
  C.initialized = new ReactiveVar(false);

  let _measureColumnHeights = function() {
    _columnElements = C._template.$('[data-column]');
    if (!_columnElements || !_columnElements.length) return [];

    let heights = [];

    _columnElements.each(function(index) {
      heights[index] = $(this).outerHeight();
    });

    return heights;
  };

  C.clear = function(cb) {
    if (!_columnElements || !_columnElements.length) return;
    _tiles = [];

    // Create array of arrays
    C.columns.set(
      mout.array.range(0, _options.columns - 1).map(function() {
        return [];
      })
    );

    // Wait for new columns to render
    Meteor.defer(function() {
      if (!C._template) return;
      if (C._template.view.isDestroyed) return;
      _columnElements = C._template.$('[data-column]');
      if (mout.lang.isFunction(cb)) {
        cb.call(C);
      }
    });
  };

  C._onInitCallbacks = [];
  C._addOnInitialized = function(tiles, callback) {
    C._onInitCallbacks.push([tiles, callback]);
  };

  C.addTiles = function(tiles, callback) {
    let inited = C.initialized.curValue;

    if (!inited) {
      C._addOnInitialized(tiles, callback);
      return;
    }

    Meteor.defer(function() {
      if (!C._template) return;

      _tiles = _tiles.concat(tiles);
      let columns = C.columns.get();

      let columnHeights = _measureColumnHeights();

      tiles.forEach(function(tile) {
        let shortestColumn = columnHeights.indexOf(
          mout.array.min(columnHeights)
        );
        let tileHeight = _options.calculateApproximateTileHeight(
          tile,
          _columnElements.eq(0).width()
        );

        columnHeights[shortestColumn] += tileHeight;
        if (columns[shortestColumn]) columns[shortestColumn].push(tile);
      });
      C.columns.set(columns);

      if (callback) {
        callback.call(C);
      }
    });
  };

  C.setColumns = function(amount, cb) {
    let tilesBackup = _tiles;
    _options.columns = amount;

    C.clear(function callback() {
      C.addTiles(tilesBackup);

      if (mout.lang.isFunction(cb)) {
        cb.call(C);
      }
    });
  };
};

function getAmountOfColumnsThatFitInElement(selector, minWidth, maxColumns) {
  var maxColumns = maxColumns || 4;
  let element = $(selector)[0];
  let offsetWidth = element ? element.offsetWidth : 0;
  let layoutWidth = Math.min(window.innerWidth, offsetWidth);
  return Math.max(Math.min(Math.floor(layoutWidth / minWidth), maxColumns), 1);
}

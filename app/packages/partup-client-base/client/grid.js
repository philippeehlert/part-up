/**
 * Grid
 *
 * @class grid
 * @memberof Partup.client
 */
Partup.client.grid = {
  /**
   * Column size
   *
   * @constant
   */
  COLUMN: 80,

  /**
   * Gap
   *
   * @constant
   */
  GAP: 18,

  /**
   * Calculate width by count of columns
   *
   * @param number {Number} Amount of columns
   * @returns width {Number} Calculated width
   */
  getWidth: function(number) {
    let col = Partup.client.grid.COLUMN;
    let gap = Partup.client.grid.GAP;
    return col + (gap + col) * (number - 1);
  },
};

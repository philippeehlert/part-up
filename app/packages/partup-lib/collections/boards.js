/**
 * Board model
 *
 * @memberOf Boards
 */
let Board = function(document) {
  _.extend(this, document);
};

/**
 * Create the default set of lanes
 *
 * @memberOf Boards
 */
Board.prototype.createDefaultLane = function() {
  let laneId = Random.id();
  Lanes.insert({
    _id: laneId,
    activities: [],
    board_id: this._id,
    created_at: new Date(),
    name: 'Backlog',
    updated_at: new Date(),
  });

  // Store the lane IDs
  Boards.update(this._id, { $addToSet: { lanes: laneId } });
};

/**
 * Remove a specific lane from a board
 *
 * @memberOf Boards
 *
 */
Board.prototype.removeLane = function(laneId, laneActivities) {
  let lanes = this.lanes || [];
  let laneIndex = lanes.indexOf(laneId);
  if (laneIndex > -1) {
    lanes.splice(laneIndex, 1);

    // Set the remaining activities of the removed lane to the first lane
    Lanes.update(lanes[0], {
      $addToSet: { activities: { $each: laneActivities } },
    });
  }

  // Store the updated lane list
  Boards.update(this._id, { $set: { lanes: lanes } });
};

/**
 @namespace Boards
 */
Boards = new Mongo.Collection('boards', {
  transform: function(document) {
    return new Board(document);
  },
});

/**
 * Find the board for a partup
 *
 * @memberOf Boards
 * @param {Partup} partup
 * @param {String} userId
 * @return {Mongo.Cursor}
 */
Boards.findForPartup = function(partup, userId) {
  if (!partup || !partup.isViewableByUser(userId)) return null;
  return Boards.find({ _id: partup.board_id }, { limit: 1 });
};

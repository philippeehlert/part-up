/**
 * Lane model
 *
 * @memberOf Lanes
 */
var Lane = function(document) {
    _.extend(this, document);
};

/**
 * Add an activity to the lane
 *
 * @memberOf Lanes
 */
Lane.prototype.addActivity = function(activityId) {
    Lanes.update(this._id, {$addToSet: {activities: activityId}});
};

/**
 * Remove a specific activity from the lane
 *
 * @memberOf Lanes
 */
Lane.prototype.removeActivity = function(activityId) {
    Lanes.update(this._id, {$pull: {activities: activityId}});
};

/**
 @namespace Lanes
 */
Lanes = new Mongo.Collection('lanes', {
    transform: function(document) {
        return new Lane(document);
    }
});

// Add indices
if (Meteor.isServer) {
    Lanes._ensureIndex('board_id');
}

/**
 * Find the lanes for a board
 *
 * @memberOf Lanes
 * @param {Board} board
 * @return {Mongo.Cursor}
 */
Lanes.findForBoard = function(board) {
    return Lanes.find({board_id: board._id});
};

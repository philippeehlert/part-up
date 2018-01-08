Meteor.methods({
  /**
   * Insert a board
   *
   * @param partup_id
   */
  'boards.insert': function(partup_id) {
    check(partup_id, String);

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(401, 'unauthorized');

    try {
      let board = {
        _id: Random.id(),
        created_at: new Date(),
        lanes: [],
        partup_id: partup_id,
        updated_at: new Date(),
      };

      Boards.insert(board);

      return board._id;
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'board_could_not_be_inserted');
    }
  },

  /**
   * Update a board
   *
   * @param board_id
   * @param fields
   */
  'boards.update': function(board_id, fields) {
    check(board_id, String);
    check(fields, Partup.schemas.forms.board);

    let user = Meteor.user();
    let board = Boards.findOneOrFail(board_id);
    let partup = Partups.findOneOrFail(board.partup_id);

    if (!user || !partup.hasUpper(user._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      Boards.update(board._id, {
        $set: { lanes: fields.lanes, updated_at: new Date() },
      });

      return board._id;
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'board_could_not_be_updated');
    }
  },
});

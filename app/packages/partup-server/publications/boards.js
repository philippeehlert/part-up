Meteor.publishComposite('board.for_partup_id', function(partupId) {
  check(partupId, String);
  this.unblock();
  let partup = Partups.findOne(partupId);

  return {
    find: function() {
      return Boards.findForPartup(partup, this.userId);
    },
    children: [{ find: Lanes.findForBoard }],
  };
});

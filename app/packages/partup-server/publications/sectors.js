/**
 * Publish all sectors
 *
 */
Meteor.publishComposite('sectors.all', function() {
  return {
    find: function() {
      return Sectors.find();
    },
  };
});

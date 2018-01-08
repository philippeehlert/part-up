Meteor.publishComposite('contentblocks.by_network_slug', function(networkSlug) {
  check(networkSlug, String);

  this.unblock();

  return {
    find: function() {
      return Networks.guardedFind(
        this.userId,
        { slug: networkSlug },
        { limit: 1 }
      );
    },
    children: [
      {
        find: function(network) {
          return ContentBlocks.find({
            _id: { $in: network.contentblocks || [] },
          });
        },
        children: [{ find: Images.findForContentBlock }],
      },
    ],
  };
});

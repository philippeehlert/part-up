Template.Start_MostActive.helpers({
  data: function() {
    const { networkSlug: slug } = this;
    const network = Networks.findOne({ slug });
    const { most_active_partups = [] } = network;
    return {
      partups: () => Partups.find({ _id: { $in: most_active_partups } }),
      network: () => network,
    };
  },
});

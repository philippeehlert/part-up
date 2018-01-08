Template.Start_JoinButton.helpers({
  data: function() {
    const { networkSlug: slug } = this;
    const network = Networks.findOne({ slug });
    return {
      network: () => network,
    };
  },
});

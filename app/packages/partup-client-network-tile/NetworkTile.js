Template.NetworkTile.onCreated(function() {
  let networkSlug = this.data.networkSlug;
  this.subscribe('networks.one', networkSlug);
});

Template.NetworkTile.helpers({
  data: function() {
    let networkSlug = this.networkSlug;
    let network = Networks.findOne({ slug: networkSlug });
    return {
      networkLogo: function() {
        let network = this.network;

        if (network.logoObject) {
          return Partup.helpers.url.getImageUrl(network.logoObject, '360x360');
        } else if (network.imageObject) {
          return Partup.helpers.url.getImageUrl(network.imageObject, '360x360');
        }

        return '';
      },
      network: function() {
        return network;
      },
    };
  },
});

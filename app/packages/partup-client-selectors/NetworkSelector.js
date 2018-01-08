Template.NetworkSelector.onCreated(function() {
  let template = this;

  template.networks = new ReactiveVar([]);

  let query = {};
  query.userId = Meteor.userId();

  HTTP.get(
    '/networks-discoverfilter' + mout.queryString.encode(query),
    {
      headers: {
        Authorization: 'Bearer ' + Accounts._storedLoginToken(),
      },
    },
    function(error, response) {
      if (error) throw new Error(error);

      let networks = response.data.networks
        .map(function(network) {
          Partup.client.embed.network(
            network,
            response.data['cfs.images.filerecord']
          );
          network.iconObject =
            network.iconObject ||
            Images.findOne({ _id: network.icon }) ||
            network.imageObject ||
            Images.findOne({ _id: network.image });
          return network;
        })
        .sort(Partup.client.sort.alphabeticallyASC.bind(null, 'name'));

      template.networks.set(networks);
    }
  );
});

Template.NetworkSelector.helpers({
  networks: function() {
    return Template.instance().networks.get();
  },
});

Template.NetworkSelector.events({
  'click [data-select-network]': function(event, template) {
    event.preventDefault();

    let networks = template.networks.get();

    if (!networks || !networks.length) return;

    let networkId = event.currentTarget.getAttribute('data-select-network');
    let network = lodash.find(networks, { _id: networkId });

    if (template.data.onSelect) template.data.onSelect(network);
  },
  'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]':
    Partup.client.scroll.preventScrollPropagation,
});

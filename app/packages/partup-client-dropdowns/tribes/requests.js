import _ from 'lodash';

// Ideally you want to use promises for these requests but I'm unsure how to do this with compatibility in IE.

export default (httpGet = {
  getForMenu(template) {
    if (!Meteor.userId()) {
      return;
    }

    template.loadingNetworks.set(true);
    template.loadingUpperPartups.set(true);
    template.loadingSupporterPartups.set(true);

    HTTP.get(
      `/users/${Meteor.userId()}/menu` +
        mout.queryString.encode(template.query),
      function(error, response) {
        if (error || !response.data) {
          return;
        }
        const result = response.data;
        const user = result.users[0];

        if (result.networks && result.networks.length > 0) {
          template.results.networks.set(
            _.map(result.networks, (network) =>
              Partup.client.embed.network(
                network,
                result['cfs.images.filerecord']
              )
            ).map((network) =>
              _.assign({}, network, {
                uppers: [Meteor.user()._id],
              })
            )
          );
        } else {
          template.loadingNetworks.set(false);
        }

        if (result.partups && result.partups.length > 0) {
          const upperpartups = [];
          const supporterpartups = [];

          _.forEach(
            _.map(result.partups, (partup) =>
              Partup.client.embed.partup(
                partup,
                result['cfs.images.filerecord']
              )
            ),
            (partup) => {
              if (
                user.upperOf &&
                user.upperOf.find((id) => id === partup._id)
              ) {
                upperpartups.push(partup);
              }
              if (
                user.supporterOf &&
                user.supporterOf.find((id) => id === partup._id)
              ) {
                supporterpartups.push(partup);
              }
            }
          );

          template.results.upperPartups.set(upperpartups);
          template.results.supporterPartups.set(supporterpartups);
        } else {
          template.loadingUpperPartups.set(false);
          template.loadingSupporterPartups.set(false);
        }
      }
    );
  },
});

Template.Start_Header.helpers({
    data(...args) {
        const network = Networks.findOne({slug: this.networkSlug});
        if (!network) return;

        const {
            _id: networkId,
            slug: networkSlug,
            name: networkName,
            most_active_uppers: uppers,
            most_active_partups: partups,
            stats: {
                upper_count: totalUppers,
                partup_count: totalPartups,
            } = {},
        } = network;

        Partup.client.windowTitle.setContextName(networkName);

        return {
            network: () => network,
            partups: () => Partups.findForNetwork(network),
            activeUppers: () => ({ networkId, networkSlug, totalUppers, uppers }),
            activePartups: () => ({ networkId, networkSlug, totalPartups, partups }),
        };
    },
});

Template.Start_Header.events({
    'click [data-open-networksettings]': function(event, { data: { networkSlug: slug } }) {
        event.preventDefault();
        Intent.go({
            route: 'network-settings',
            params: { slug },
        });
    }
});

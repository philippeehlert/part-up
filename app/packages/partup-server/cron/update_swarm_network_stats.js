if (process.env.PARTUP_CRON_ENABLED) {
  SyncedCron.add({
    name: 'Update the swarm and network stats of Part-up',
    schedule: function(parser) {
      return parser.text(Partup.constants.CRON_UPDATE_SWARM_NETWORK_STATS);
    },
    job: function() {
      let updated_networks = [];

      // Let's begin with the swarms
      Swarms.find().forEach(function(swarm) {
        let swarm_networks = Partup.server.services.swarms.updateStats(swarm);
        updated_networks.push(...swarm_networks);
      });

      // Now update the networks that aren't in a network
      Networks.find({
        _id: { $nin: updated_networks },
        archived_at: { $exists: false },
      }).forEach(function(networkId) {
        let network = Networks.findOne(networkId);
        Partup.server.services.networks.updateStats(network);
      });
    },
  });
}

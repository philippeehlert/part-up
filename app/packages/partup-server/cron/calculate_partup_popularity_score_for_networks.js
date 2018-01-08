if (process.env.PARTUP_CRON_ENABLED) {
  SyncedCron.add({
    name: 'Calculate the Part-up popularity score for networks (tribes)',
    schedule: function(parser) {
      return parser.text(Partup.constants.CRON_NETWORK_POPULARITY);
    },
    job: function() {
      Networks.find({}).forEach(function(network) {
        let score = Partup.server.services.network_popularity_calculator.calculateNetworkPopularityScore(
          network._id
        );
        Networks.update(network._id, { $set: { popularity: score } });
      });
    },
  });
}

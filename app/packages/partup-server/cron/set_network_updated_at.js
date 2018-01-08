if (process.env.PARTUP_CRON_ENABLED) {
  SyncedCron.add({
    name:
      'Update the updated_at of a network if needed, based on partup Updates and network ChatMessages',
    schedule: function(parser) {
      return parser.text(Partup.constants.CRON_SET_NETWORK_UPDATED_AT);
    },
    job: function() {
      Networks.find().forEach(function(network) {
        Partup.server.services.networks.setUpdatedAt(network);
      });
    },
  });
}

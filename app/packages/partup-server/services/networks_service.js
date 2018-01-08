let d = Debug('services:networks');

/**
 @namespace Partup server networks service
 @name Partup.server.services.networks
 @memberof Partup.server.services
 */
Partup.server.services.networks = {
  /**
   * Update the stats of a network
   *
   * @param {Object} network
   */
  updateStats: function(network) {
    // Initialize stats counters
    let network_stats = {
      activity_count: 0,
      partner_count: 0,
      partup_count: 0,
      supporter_count: 0,
      upper_count: 0,
    };
    let unique_network_partners = [];
    let unique_network_supporters = [];

    // Store the partup IDs to loop through for the activities
    let partups = Partups.find(
      {
        network_id: network._id,
        deleted_at: { $exists: false },
        archived_at: { $exists: false },
      },
      { _id: 1 }
    ).fetch();
    let network_partups = [];
    partups.forEach(function(partup) {
      network_partups.push(partup._id);
    });

    // Update the partup counter with the amount of partups in this network
    network_stats.partup_count = network_partups.length;

    // Update the upper counter with the amount of uppers in this network
    let network_uppers = network.uppers || [];
    network_stats.upper_count = network_uppers.length;

    // Loop through each partup to get activity and supporter count
    network_partups.forEach(function(partupId) {
      // Retrieve the partup
      let partup = Partups.findOne(partupId);

      // Update the activity counter with the amount of activities in this partup
      let partup_activity_count = partup.activity_count || 0;
      network_stats.activity_count += partup_activity_count;

      // Update the partner array
      let partup_partners = partup.uppers || [];
      unique_network_partners.push(...partup_partners);

      // And lastly, update the supporter array
      let partup_supporters = partup.supporters || [];
      unique_network_supporters.push(...partup_supporters);
    });

    // Deduping the network-level dups
    network_stats.partner_count = lodash.unique(unique_network_partners).length;
    network_stats.supporter_count = lodash.unique(
      unique_network_supporters
    ).length;

    // Update the network with the new stats
    Networks.update(network._id, {
      $set: {
        stats: network_stats,
        updated_at: new Date(),
      },
    });
  },

  /**
   * Calculate the most active uppers of a network
   *
   * @param {Object} network
   */
  calculateActiveUppers: function(network) {
    // Initialization
    let network_uppers = network.uppers || [];
    let network_partners = [];

    Partups.find({
      network_id: network._id,
      deleted_at: { $exists: false },
      archived_at: { $exists: false },
    })
      .fetch()
      .forEach(function(partup) {
        let uppers = partup.uppers || [];
        network_partners.push(...uppers);
      });

    // We now have all the partners, so sort on frequency
    network_partners = lodash
      .chain(network_partners)
      .countBy()
      .pairs()
      .sortBy(1)
      .reverse()
      .pluck(0)
      .value();

    // We only want the uppers that are member of the tribe in our array
    let active_uppers = lodash.intersection(network_partners, network_uppers);
    let leftover_uppers = lodash.difference(network_uppers, active_uppers);
    active_uppers.push(...leftover_uppers);

    // Update the network with the new stats
    Networks.update(network._id, {
      $set: {
        most_active_uppers: active_uppers.slice(0, 7), // We only need to show 7 uppers
        updated_at: new Date(),
      },
    });
  },

  /**
   * Calculate the most active partups of a network
   *
   * @param {Object} network
   */
  calculateActivePartups: function(network) {
    let partups = Partups.find(
      {
        network_id: network._id,
        deleted_at: { $exists: false },
        archived_at: { $exists: false },
      },
      {
        fields: {
          _id: 1,
          popularity: 1,
        },
        sort: {
          popularity: -1,
        },
        limit: 3,
      }
    ).fetch();

    // We now have all the partup objects, so transform them into an array containing the IDs
    let popular_partups = [];
    partups.forEach(function(partup) {
      popular_partups.push(partup._id);
    });

    // Update the network with the new stats
    Networks.update(network._id, {
      $set: {
        most_active_partups: popular_partups,
        updated_at: new Date(),
      },
    });
  },

  /**
   * Create tags that are common in the underlying partups of the network
   *
   * @param {Object} network
   */
  getCommonTags: function(network) {
    // Initialization
    let partup_tags = [];

    // Get the tags of all partups in this networks in one array
    Partups.find({
      network_id: network._id,
      deleted_at: { $exists: false },
    })
      .fetch()
      .forEach(function(partup) {
        let tags = partup.tags || [];
        partup_tags.push(...tags);
      });

    // We now have all the tags, so sort on frequency
    partup_tags = lodash
      .chain(partup_tags)
      .countBy()
      .pairs()
      .sortBy(1)
      .reverse()
      .pick(function(value, key) {
        return value[1] > 1; // Only collect the tags that occur more than once
      })
      .value();

    // Create an array of tag objects containing their frequency
    let common_tags = [];
    for (let key in partup_tags) {
      if (partup_tags.hasOwnProperty(key)) {
        let tagArray = partup_tags[key];

        common_tags.push({
          tag: tagArray[0],
          frequency: tagArray[1],
        });
      }
    }

    // Update the network
    Networks.update(network._id, {
      $set: {
        common_tags: common_tags,
        updated_at: new Date(),
      },
    });
  },

  /**
   * Update the updated_at of a network if needed, based on partup Updates and network ChatMessages
   *
   * @param {Object} network
   */
  setUpdatedAt: function(network) {
    // Get the latest updated Update and ChatMessage of the network
    let networkPartupIds = Partups.find(
      { network_id: network._id },
      { _id: 1 }
    ).map(function(partup) {
      return partup._id;
    });

    // Retrieve data
    let latestUpdate = Updates.findOne(
      { partup_id: { $in: networkPartupIds } },
      { fields: { updated_at: 1 }, sort: { updated_at: -1 } }
    );
    let updateUpdatedAt = latestUpdate ? latestUpdate.updated_at : null;
    let latestChatMessage = ChatMessages.findOne(
      { chat_id: network.chat_id },
      { fields: { updated_at: 1 }, sort: { updated_at: -1 } }
    );
    let chatUpdatedAt = latestChatMessage ? latestChatMessage.updated_at : null;

    // Decide
    let latestUpdatedAt =
      updateUpdatedAt > chatUpdatedAt ? updateUpdatedAt : chatUpdatedAt;

    // Update the network if needed
    if (latestUpdatedAt > network.updated_at) {
      Networks.update(network._id, {
        $set: { updated_at: latestUpdatedAt },
      });
    }
  },
};

let d = Debug('services:network_popularity_calculator');

/**
 @namespace Partup server network popularity calculator service
 @name Partup.server.services.network_popularity_calculator
 @memberof Partup.server.services
 */
Partup.server.services.network_popularity_calculator = {
  calculateNetworkPopularityScore: function(networkId) {
    let network = Networks.findOneOrFail(networkId);

    // score based on how many activity is in the network
    let activityScore = this._calculateActivityBasedScore(network);
    let activityScoreWeight = 0.3;

    // TODO:
    // add average popularity of active partups
    // add chat recency

    // score based on chat volume in the past 3 months
    let chatScore = this._calculateChatBasedScore(network);
    let chatScoreWeight = 0.2;

    // score based on total partups in network
    let partupScore = this._calculatePartupBasedScore(network);
    let partupScoreWeight = 0.2;

    // score based on total partners of partups in network
    let partnerScore = this._calculatePartnerBasedScore(network);
    let partnerScoreWeight = 0.1;

    // score based on total supporters of partups in network
    let supporterScore = this._calculateSupporterBasedScore(network);
    let supporterScoreWeight = 0.1;

    // score based on total members of network
    let memberScore = this._calculateMemberBasedScore(network);
    let memberScoreWeight = 0.1;

    let score =
      activityScore * activityScoreWeight +
      chatScore * chatScoreWeight +
      partupScore * partupScoreWeight +
      partnerScore * partnerScoreWeight +
      supporterScore * supporterScoreWeight +
      memberScore * memberScoreWeight;

    return Math.floor(score);
  },

  _calculateActivityBasedScore: function(network) {
    let stats = network.stats || {};
    let count = stats.activity_count || 0;

    if (count > 150) count = 150; // Set limit

    return count / 1.5; // Results in max score of 100%
  },

  _calculateChatBasedScore: function(network) {
    let chatId = network.chat_id;

    if (!chatId) return 0;

    let count = ChatMessages.find({
      chat_id: chatId,
      created_at: {
        $gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 90), // the past month
      },
    }).count();

    if (count > 100) count = 250; // Set limit

    return count / 2.5; // Results in max score of 100%
  },

  _calculatePartupBasedScore: function(network) {
    let stats = network.stats || {};
    let count = stats.partup_count || 0;

    return count > 100 ? 100 : count; // Results in max score of 100%
  },

  _calculatePartnerBasedScore: function(network) {
    let stats = network.stats || {};
    let count = stats.partner_count || 0;

    if (count > 150) count = 150; // Set limit

    return count / 1.5; // Results in max score of 100%
  },

  _calculateSupporterBasedScore: function(network) {
    let stats = network.stats || {};
    let count = stats.supporter_count || 0;

    if (count > 150) count = 150; // Set limit

    return count / 1.5; // Results in max score of 100%
  },

  _calculateMemberBasedScore: function(network) {
    let stats = network.stats || {};
    let count = stats.upper_count || 0;

    if (count > 150) count = 150; // Set limit

    return count / 1.5; // Results in max score of 100%
  },
};

let d = Debug('services:partup_popularity_calculator');

/**
 @namespace Partup server partup popularity calculator service
 @name Partup.server.services.partup_popularity_calculator
 @memberof Partup.server.services
 */
Partup.server.services.partup_popularity_calculator = {
  calculatePartupPopularityScore: function(partupId) {
    let partup = Partups.findOneOrFail(partupId);

    let activityScore = this._calculateActivityBasedScore(partup);
    let activityScoreWeight = 0.5;

    let shareScore = this._calculateShareBasedScore(partup);
    let shareScoreWeight = 0.2;

    let partnerScore = this._calculatePartnerBasedScore(partup);
    let partnerScoreWeight = 0.1;

    let supporterScore = this._calculateSupporterBasedScore(partup);
    let supporterScoreWeight = 0.1;

    let viewScore = this._calculateViewBasedScore(partup);
    let viewScoreWeight = 0.1;

    let score =
      activityScore * activityScoreWeight +
      shareScore * shareScoreWeight +
      partnerScore * partnerScoreWeight +
      supporterScore * supporterScoreWeight +
      viewScore * viewScoreWeight;

    return Math.floor(score);
  },

  _calculateActivityBasedScore: function(partup) {
    let count = 0;
    let now = new Date();
    let two_weeks = 1000 * 60 * 60 * 24 * 14;

    Updates.find({ partup_id: partup._id }).forEach(function(update) {
      let updated_at = new Date(update.updated_at);
      if (now - updated_at > two_weeks) return; // Don't count the updates that are older than 2 weeks
      count += update.comments_count + 1; // The additional 1 is for the update itself
    });

    if (count > 150) count = 150; // Set limit

    return count / 1.5; // Results in max score of 100%
  },

  _calculateShareBasedScore: function(partup) {
    let count = 0;
    if (!partup.shared_count) return count;
    if (partup.shared_count.facebook) count += partup.shared_count.facebook;
    if (partup.shared_count.twitter) count += partup.shared_count.twitter;
    if (partup.shared_count.linkedin) count += partup.shared_count.linkedin;
    if (partup.shared_count.email) count += partup.shared_count.email;

    return count > 100 ? 100 : count; // Results in max score of 100%
  },

  _calculatePartnerBasedScore: function(partup) {
    let partners = partup.uppers || [];
    let partnerCount = partners.length > 15 ? 15 : partners.length; // Set limit

    return partnerCount / 0.15; // Results in max score of 100%
  },

  _calculateSupporterBasedScore: function(partup) {
    let supporters = partup.supporters || [];

    return supporters.length > 100 ? 100 : supporters.length; // Results in max score of 100%
  },

  _calculateViewBasedScore: function(partup) {
    if (!partup || !partup.analytics) return 0;
    let views = partup.analytics.clicks_total || 0;
    if (views > 500) views = 500;

    return views / 5; // Results in max score of 100%
  },
};

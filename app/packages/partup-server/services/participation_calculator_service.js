let d = Debug('services:participation_calculator');

/**
 @namespace Partup server participation calculator service
 @name Partup.server.services.participation_calculator
 @memberof Partup.server.services
 */
Partup.server.services.participation_calculator = {
  calculateParticipationScoreForUpper: function(upperId) {
    let score = 0;
    let upper = Meteor.users.findOneOrFail(upperId);

    let score1 = this._calculateLoginScore(upper);
    let score1weight = 0.25;
    d(
      'Login score for user [' +
        upperId +
        '] is ' +
        score1 +
        '/100 and counts for 25% → ' +
        score1 * score1weight +
        '/100'
    );
    score += score1 * score1weight;

    let score2 = this._calculateSupportsRecentPartupsScore(upper);
    let score2weight = 0.25;
    d(
      'Supports recent partups score for user [' +
        upperId +
        '] is ' +
        score2 +
        '/100 and counts for 25% → ' +
        score2 * score2weight +
        '/100'
    );
    score += score2 * score2weight;

    let score3 = this._calculateAverageContributionRatingScore(upper);
    let score3weight = 0.25;
    d(
      'Average contribution rating score for user [' +
        upperId +
        '] is ' +
        score3 +
        '/100 and counts for 25% → ' +
        score3 * score3weight +
        '/100'
    );
    score += score3 * score3weight;

    let score4 = this._calculateActiveContributionsScore(upper);
    let score4weight = 0.25;
    d(
      'Active contributions score for user [' +
        upperId +
        '] is ' +
        score4 +
        '/100 and counts for 25% → ' +
        score4 * score4weight +
        '/100'
    );
    score += score4 * score4weight;

    d(
      'Total participation score for user [' +
        upperId +
        '] is ' +
        score +
        '/100'
    );

    return Math.min(100, score);
  },

  _calculateActiveContributionsScore: function(upper) {
    let activeContributionsScore = 0;

    // By using a score delta of 4, an upper can receive the full
    // 100 score of this part by having 25 active contributions
    let scoreDelta = 4;

    let contributions = Contributions.find({
      upper_id: upper._id,
      verified: true,
    });

    contributions.forEach(function(contribution) {
      let partup = Partups.findOne(contribution.partup_id);

      if (partup && !partup.hasEnded()) {
        activeContributionsScore += scoreDelta;
      }
    });

    return Math.min(100, activeContributionsScore);
  },

  _calculateAverageContributionRatingScore: function(upper) {
    return Math.min(100, upper.average_rating || 0);
  },

  _calculateSupportsRecentPartupsScore: function(upper) {
    let supports = upper.supporterOf || [];
    let partups = Partups.find({ _id: { $in: supports } });

    let supportsRecentPartupsScore = 0;

    // By using a score delta of 4, an upper can receive the full
    // 100 score of this part by supporting 25 active partups
    let scoreDelta = 4;

    partups.forEach(function(partup) {
      if (!partup.hasEnded()) {
        supportsRecentPartupsScore += scoreDelta;
      }
    });

    return Math.min(100, supportsRecentPartupsScore);
  },

  _calculateLoginScore: function(upper) {
    let logins = upper.logins || [];

    let loginScore = 0;

    // By using a score delta of 4, an upper can receive the full
    // 100 score of this part by logging in 25 days consecutively
    let scoreDelta = 4;

    let day = 24 * 60 * 60 * 1000;
    let now = new Date();
    let createdAt = new Date(upper.createdAt);
    let createdDaysAgo = (now - createdAt) / day;

    let maximumDaysAgoToGiveScore = 25;

    if (createdDaysAgo <= maximumDaysAgoToGiveScore) {
      loginScore += scoreDelta * (maximumDaysAgoToGiveScore - createdDaysAgo);
    }

    logins.forEach(function(login) {
      let daysBetweenLoginAndNow = Math.round(
        Math.abs((login.getTime() - now.getTime()) / day)
      );

      if (daysBetweenLoginAndNow <= maximumDaysAgoToGiveScore) {
        loginScore += scoreDelta;
      }
    });

    return Math.min(100, loginScore);
  },
};

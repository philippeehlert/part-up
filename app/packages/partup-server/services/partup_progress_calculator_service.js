let d = Debug('services:partup_progress_calculator');

/**
 @namespace Partup server partup progress calculator service
 @name Partup.server.services.partup_progress_calculator
 @memberof Partup.server.services
 */
Partup.server.services.partup_progress_calculator = {
  calculatePartupProgressScore: function(partupId) {
    let score = 0;
    let partup = Partups.findOneOrFail(partupId);

    let score1 = this._calculateTimeBasedScore(partup);
    d('Time based partup progress score is ' + score1);
    score += score1;

    let score2 = this._calculateUppersBasedScore(partup);
    let score2weight = 0.1;
    d('Upper based partup progress score is ' + score2 * score2weight);
    score += score2 * score2weight;

    let score3 = this._calculateActivitiesBasedScore(partup);
    let score3weight = 0.8;
    d('Activities based partup progress score is ' + score3 * score3weight);
    score += score3 * score3weight;

    return Math.max(0, Math.min(100, score));
  },

  _calculateActivitiesBasedScore: function(partup) {
    let score = 0;
    let activities = Activities.findForPartup(partup);

    activities.forEach(function(activity) {
      if (activity.isClosed()) score += 20;
      else score -= 10;
    });

    return Math.min(100, score);
  },

  _calculateUppersBasedScore: function(partup) {
    let uppers = partup.uppers || [];
    let score = uppers.length * (1 / 3) * 100;

    return Math.min(100, score);
  },

  _calculateTimeBasedScore: function(partup) {
    if (partup.hasEnded()) return 100;

    let day = 1000 * 60 * 60 * 24;

    let now = new Date();
    let endsAt = new Date(partup.end_date);
    let createdAt = new Date(partup.created_at);

    let daysTotal = (endsAt - createdAt) / day;
    let daysExists = (now - createdAt) / day;

    let percentage = daysExists / daysTotal * 100;

    let score = Math.pow(0.0465 * percentage, 3);

    return Math.min(100, score);
  },
};

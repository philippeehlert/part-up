// jscs:disable
/**
 * A widget that will render all given ratings
 *
 * @module client-ratings
 * @param {Cursor} contribution The contribution which is being rated
 * @param {Cursor} ratings      A Mongo Cursor object
 * @param {Boolean} READONLY    Whether the widget should be rendered readonly
 */
// jscs:enable

/** ***********************************************************/
/* Widget initial */
/** ***********************************************************/
Template.Ratings.onCreated(function() {
  this.openHoverCards = new ReactiveVar([]);
});

Template.Ratings.onRendered(function() {
  let template = this;
  template.clickHandler = function(e) {
    let avatar = $(e.target).closest('[data-rating-id]');

    let openHoverCards = [];
    if (!avatar.length) {
      openHoverCards = [];
    } else {
      openHoverCards = [avatar[0].dataset.ratingId];
    }

    template.openHoverCards.set(openHoverCards);
    return;
  };
  document.body.addEventListener('click', template.clickHandler);
});

Template.Ratings.onDestroyed(function() {
  let template = this;
  document.body.removeEventListener('click', template.clickHandler);
});

/** ***********************************************************/
/* Widget helpers */
/** ***********************************************************/
Template.Ratings.helpers({
  averageRatings: function() {
    let sum = 0;
    let ratings = this.ratings.fetch();

    for (var i = 0; i < ratings.length; i++) {
      sum += ratings[i].rating;
    }

    let average = sum / ratings.length;
    let items = [];

    for (i = 10; i <= 100; i += 10) {
      items.push(i <= average ? 'pu-state-active' : '');
    }

    return items;
  },
  contribution: function() {
    return Template.instance().data.contribution;
  },
  hasRatings: function() {
    return !!this.ratings.fetch().length;
  },
  showHoverCard: function() {
    let template = Template.instance();
    let id = this._id || 'new-' + template.data.contribution._id;
    return mout.array.contains(template.openHoverCards.get(), id);
  },
  showNewRating: function() {
    if (this.READONLY) return false;

    let user = Meteor.user();
    if (!user || user._id === this.contribution.upper_id) return false;

    let partup = Partups.findOne({ _id: this.contribution.partup_id });
    if (!partup) return false;

    let ratingUppers = mout.array.map(this.ratings.fetch(), function(rating) {
      return rating.upper_id;
    });

    if (mout.array.contains(ratingUppers, user._id)) return false;

    return mout.array.contains(partup.uppers, user._id);
  },
  upper: function() {
    return Meteor.users.findOne({ _id: this.upper_id });
  },
});

/** ***********************************************************/
/* Widget events */
/** ***********************************************************/
Template.Ratings.events({
  'click .pu-avatar': function(event, template) {
    // check if the click is inside the hovercard
    if ($(event.target).closest('.pu-hovercard').length) return;

    let id = $(event.target)
      .closest('.pu-avatar')
      .data('rating-id');
    let openHoverCards = template.openHoverCards.get();
    mout.array.insert(openHoverCards, id);
    template.openHoverCards.set(openHoverCards);
  },
  'keydown textarea': function(event, template) {
    if (event.keyCode !== 13) return;
    event.preventDefault();
    let id =
      $(event.target)
        .closest('.pu-avatar')
        .data('rating-id') || 'new';

    let openHoverCards = template.openHoverCards.get();
    mout.array.removeAll(openHoverCards, id);
    template.openHoverCards.set(openHoverCards);
  },
});

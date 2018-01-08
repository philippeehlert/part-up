/** ***********************************************************/
/* Widget initial */
/** ***********************************************************/
let getActivities = function(partupId) {
  let partup = Partups.findOne(partupId);
  if (!partup) return;
  return Activities.findForPartup(partup, { sort: { created_at: -1 } });
};

Template.modal_create_activities.onCreated(function() {
  this.partupId =
    mout.object.get(this, 'data.partupId') || Router.current().params._id; // strange fix. this.data can be `null` in some cases
  this.subscribe('partups.one', this.partupId);

  let activities_sub = this.subscribe('activities.from_partup', this.partupId);
  this.autorun(function(c) {
    if (activities_sub.ready()) {
      c.stop();
      Meteor.defer(Partup.client.scroll.triggerUpdate);
    }
  });
});

/** ***********************************************************/
/* Widget helpers */
/** ***********************************************************/
Template.modal_create_activities.helpers({
  partupId() {
    return Template.instance().partupId;
  },
  Partup: Partup,
  partupActivities: function() {
    return getActivities(this.partupId);
  },
  createCallback: function() {
    let template = Template.instance();
    return function(activityId) {
      Meteor.defer(function() {
        Partup.client.scroll.to(template.find('.pu-activity-create'), 0, {
          duration: 250,
          callback: function() {
            template
              .$('[data-activity-id=' + activityId + ']')
              .addClass('pu-state-highlight');
          },
        });
      });
    };
  },
  showActivityPlaceholder: function() {
    let activities = getActivities(this.partupId);
    if (!activities) return true;

    return activities.count() === 0;
  },
  placeholderActivity: function() {
    return {
      name: TAPi18n.__('pages-modal-create-activities-placeholder-name'),
      description: TAPi18n.__(
        'pages-modal-create-activities-placeholder-description'
      ),
      placeholder: true,
    };
  },
  isUpper: function() {
    let templateData = Template.currentData();

    let userId = Meteor.userId();
    if (!userId) return false;

    let partupId = templateData.partupId;
    if (!partupId) return false;

    let partup = Partups.findOne(partupId);
    if (!partup) return false;

    return partup.hasUpper(userId);
  },
  fixFooter: function() {
    return (
      Partup.client.scroll.pos.get() < Partup.client.scroll.maxScroll() - 50
    );
  },
});

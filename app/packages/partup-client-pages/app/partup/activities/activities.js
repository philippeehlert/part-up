Template.app_partup_activities.onCreated(function() {
  let template = this;
  template.partup = Partups.findOne(template.data.partupId);

  template.activities = {
    // States
    loading: new ReactiveVar(false),

    // Filter
    filter: new ReactiveVar('default'),

    // All activities
    all: function(options) {
      var options = options || {};

      let filter = template.activities.filter.get();

      let activities = Activities.findForPartup(
        template.partup,
        {},
        { archived: !!options.archived }
      )
        .fetch()
        .filter(function(activity, idx) {
          if (filter === 'my-activities') {
            return (
              activity.creator_id && activity.creator_id === Meteor.user()._id
            );
          }

          if (filter === 'open-activities') {
            return Contributions.findForActivity(activity).count() === 0;
          }

          return true;
        })
        .sort(Partup.client.sort.dateASC.bind(null, 'created_at'))
        .sort(Partup.client.sort.dateASC.bind(null, 'end_date'));

      return activities;
    },
  };

  template.createNewActivity = function(laneId) {
    let userId = Meteor.userId();
    let proceed = function() {
      Partup.client.popup.open({
        id: 'new-activity',
        parameters: {
          laneId: laneId,
        },
      });
    };

    if (!userId) {
      Intent.go({ route: 'login' }, function(user) {
        if (user) proceed();
      });
    } else {
      proceed();
    }
  };
});

Template.app_partup_activities.helpers({
  activities: function() {
    return Template.instance().activities.all({ archived: false });
  },
  allActivities: function() {
    return Template.instance().activities.all();
  },
  archivedActivities: function() {
    return Template.instance().activities.all({ archived: true });
  },
  isUpper: function() {
    let partupId = Template.instance().data.partupId;
    let partup = Partups.findOne({ _id: partupId });

    if (!partup || !partup.uppers) return false;

    let user = Meteor.user();
    if (!user) return false;

    return partup.uppers.indexOf(user._id) > -1;
  },
  filterReactiveVar: function() {
    return Template.instance().activities.filter;
  },

  // Loading state
  activitiesLoading: function() {
    return Template.instance().activities.loading.get();
  },

  createCallback: function() {
    let template = Template.instance();
    return function(activityId) {
      Meteor.defer(function() {
        Partup.client.scroll.to(
          template.find('[data-activity-id=' + activityId + ']'),
          0,
          {
            duration: 250,
            callback: function() {
              template
                .$('[data-activity-id=' + activityId + ']')
                .addClass('pu-state-highlight');
            },
          }
        );
      });
    };
  },
  boardViewEnabled: function() {
    let template = Template.instance();
    let partup = Partups.findOne(template.data.partupId);
    if (!partup) return false;
    return partup.board_view;
  },
  partupId: function() {
    return Template.instance().data.partupId;
  },
  onAddHook: function() {
    return Template.instance().createNewActivity;
  },
});

Template.app_partup_activities.events({
  'click [data-new-activity]': function(event, template) {
    event.preventDefault();

    template.createNewActivity();
  },
});

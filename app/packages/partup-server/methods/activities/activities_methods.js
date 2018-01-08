import _ from 'lodash';

Meteor.methods({
  /**
   * Insert an Activity
   *
   * @param {string} partupId
   * @param {mixed[]} fields
   */
  'activities.insert': function(partupId, fields) {
    check(partupId, String);
    check(fields, Partup.schemas.forms.activity);

    let upper = Meteor.user();
    let partup = Partups.findOneOrFail({ _id: partupId });
    if (!upper || !partup.hasUpper(upper._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      let activity = Partup.transformers.activity.fromForm(
        fields,
        upper._id,
        partupId
      );

      // Insert activity
      activity._id = Activities.insert(activity);

      // Add activity to a lane
      if (activity.lane_id) {
        let lane = Lanes.findOneOrFail(activity.lane_id);
        lane.addActivity(activity._id);
      } else {
        // No board view, so add to Backlog lane
        let board = Boards.findOneOrFail(partup.board_id);
        let backlogLane = Lanes.findOneOrFail(board.lanes[0]);
        backlogLane.addActivity(activity._id);
        Activities.update(activity._id, {
          $set: { lane_id: backlogLane._id },
        });
      }

      // Update the activity count of the Partup
      Partups.update(partupId, {
        $inc: {
          activity_count: 1,
        },
      });

      return {
        _id: activity._id,
      };
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(400, 'activity_could_not_be_inserted');
    }
  },

  /**
   * Update an Activity
   *
   * @param {string} activityId
   * @param {mixed[]} fields
   */
  'activities.update': function(activityId, fields) {
    check(activityId, String);
    check(fields, Partup.schemas.forms.startActivities);
    let upper = Meteor.user();
    let activity = Activities.findOneOrFail(activityId);

    // if (activity.isRemoved()) throw new Meteor.Error(404, 'activity_could_not_be_found');

    let partup = Partups.findOneOrFail(activity.partup_id);

    if (!upper || !partup.hasUpper(upper._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      let updatedActivity = Partup.transformers.activity.fromForm(
        fields,
        activity.creator_id,
        activity.partup_id
      );

      updatedActivity.updated_at = new Date();

      Activities.update(activityId, {
        $set: { ...activity, ...updatedActivity },
      });

      // Post system message
      Partup.server.services.system_messages.send(
        upper,
        activity.update_id,
        'system_activities_updated'
      );

      return {
        _id: activity._id,
      };
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(500, 'activity_could_not_be_updated');
    }
  },

  /**
   * Update an Activity
   *
   * @param {string} activityId
   * @param {mixed[]} fields
   */
  'activities.update_lane': function(activityId, laneId) {
    check(activityId, String);
    check(laneId, String);
    let upper = Meteor.user();
    let activity = Activities.findOneOrFail(activityId);

    // if (activity.isRemoved()) throw new Meteor.Error(404, 'activity_could_not_be_found');

    let partup = Partups.findOneOrFail(activity.partup_id);

    if (!upper || !partup.hasUpper(upper._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      Activities.update(activityId, {
        $set: { lane_id: laneId, updated_at: new Date() },
      });
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(500, 'activity_could_not_be_updated');
    }
  },

  /**
   * Remove an Activity
   *
   * @param {string} activityId
   */
  'activities.remove': function(activityId) {
    check(activityId, String);

    let upper = Meteor.user();
    let activity = Activities.findOneOrFail(activityId);

    if (activity.isRemoved()) {
      throw new Meteor.Error(404, 'activity_could_not_be_found');
    }

    let partup = Partups.findOneOrFail({ _id: activity.partup_id });

    if (!upper || !partup.hasUpper(upper._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      // Check if the activity is in a lane, and remove from there if so
      if (activity.lane_id) {
        let lane = Lanes.findOneOrFail(activity.lane_id);
        lane.removeActivity(activity._id);
      }

      const { images = [], documents = [] } = _.get(activity, 'files', {});
      _.each(images, (id) => {
        Meteor.call('images.remove', id, function(error) {
          if (error) {
            throw error;
          }
        });
      });
      _.each(documents, (id) => {
        Meteor.call('files.remove', id, function(error) {
          if (error) {
            throw error;
          }
        });
      });

      activity.remove();

      // Post system message
      Partup.server.services.system_messages.send(
        upper,
        activity.update_id,
        'system_activities_removed'
      );

      return {
        _id: activity._id,
      };
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(500, 'activity_could_not_be_removed');
    }
  },

  /**
   * Unarchive an Activity
   *
   * @param  {string} activityId
   */
  'activities.unarchive': function(activityId) {
    check(activityId, String);

    let upper = Meteor.user();
    let activity = Activities.findOneOrFail(activityId);

    if (activity.isRemoved()) {
      throw new Meteor.Error(404, 'activity_could_not_be_found');
    }

    let partup = Partups.findOneOrFail({ _id: activity.partup_id });

    if (!upper || !partup.hasUpper(upper._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      Activities.update(activityId, { $set: { archived: false } });
      Partups.update(partup._id, { $inc: { activity_count: 1 } });

      // Post system message
      Partup.server.services.system_messages.send(
        upper,
        activity.update_id,
        'system_activities_unarchived'
      );

      Event.emit('partups.activities.unarchived', upper._id, activity);

      return {
        _id: activity._id,
      };
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(500, 'activity_could_not_be_unarchived');
    }
  },

  /**
   * Archive an Activity
   *
   * @param  {string} activityId
   */
  'activities.archive': function(activityId) {
    check(activityId, String);
    let upper = Meteor.user();
    let activity = Activities.findOneOrFail(activityId);

    if (activity.isRemoved()) {
      throw new Meteor.Error(404, 'activity_could_not_be_found');
    }

    let partup = Partups.findOneOrFail({ _id: activity.partup_id });

    if (!upper || !partup.hasUpper(upper._id)) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    try {
      Activities.update(activityId, { $set: { archived: true } });
      Partups.update(partup._id, { $inc: { activity_count: -1 } });

      // Post system message
      Partup.server.services.system_messages.send(
        upper,
        activity.update_id,
        'system_activities_archived'
      );

      Event.emit('partups.activities.archived', upper._id, activity);

      return {
        _id: activity._id,
      };
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(500, 'activity_could_not_be_archived');
    }
  },

  /**
   * Copy activities from one Partup to another
   *
   * @param  {String} fromPartupId
   * @param  {String} toPartupId
   */
  'activities.copy': function(fromPartupId, toPartupId) {
    check(fromPartupId, String);
    check(toPartupId, String);

    let upper = Meteor.user();
    if (!upper) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    // Check if both Partup IDs are valid
    Partups.findOneOrFail(fromPartupId);
    const toPartup = Partups.findOneOrFail(toPartupId);

    try {
      let board = Boards.findOneOrFail(toPartup.board_id);
      let backlogLane = Lanes.findOneOrFail(board.lanes[0]);

      let existingActivities = Activities.find({
        partup_id: fromPartupId,
      }).fetch();
      existingActivities.forEach(function(activity) {
        let newActivity = {
          name: activity.name,
          description: activity.description,
          end_date: activity.end_date,
          created_at: new Date(),
          updated_at: new Date(),
          creator_id: upper._id,
          partup_id: toPartupId,
          archived: false,
        };

        const activityId = Activities.insert(newActivity);

        backlogLane.addActivity(activityId);
      });

      // Add number of activities to the Part-up's activity_count
      let activityCount = existingActivities.length;
      Partups.update(toPartupId, {
        $inc: { activity_count: activityCount },
      });

      return true;
    } catch (error) {
      Log.error(error);
      throw new Meteor.Error(500, 'activities_could_not_be_copied_from_partup');
    }
  },

  /**
   * Get user suggestions for a given activity
   *
   * @param {string} activityId
   * @param {Object} options
   * @param {string} options.query
   * @param {string} options.network
   * @param {Number} options.limit
   * @param {Number} options.skip
   *
   * @return {[string]}
   */
  'activities.user_suggestions': function(activityId, options) {
    check(activityId, String);
    check(options, {
      query: Match.Optional(String),
      network: Match.Optional(String),
      limit: Match.Optional(Number),
      skip: Match.Optional(Number),
    });

    this.unblock();

    let upper = Meteor.user();

    if (!upper) {
      throw new Meteor.Error(401, 'Unauthorized');
    }

    let users = Partup.server.services.matching.matchUppersForActivity(
      activityId,
      options
    );

    // We are returning an array of IDs instead of an object
    return users.map(function(user) {
      return user._id;
    });
  },

  /**
   * Invite someone to an activity
   *
   * @param {string} activityId
   * @param {Object} fields
   * @param {[Object]} fields.invitees
   * @param {String} fields.invitees.name
   * @param {String} fields.invitees.email
   * @param {String} fields.message
   */
  'activities.invite_by_email': function(activityId, fields) {
    check(activityId, String);
    check(fields, Partup.schemas.forms.inviteUpper);

    let inviter = Meteor.user();

    if (!inviter) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    let activity = Activities.findOneOrFail(activityId);

    if (activity.isRemoved()) {
      throw new Meteor.Error(404, 'activity_could_not_be_found');
    }

    let partup = Partups.findOneOrFail(activity.partup_id);

    let isAllowedToAccessPartup =
      !!Partups.guardedFind(inviter._id, {
        _id: activity.partup_id,
      }).count() > 0;
    if (!isAllowedToAccessPartup) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    let invitees = fields.invitees || [];

    invitees.forEach(function(invitee) {
      let isAlreadyInvited = !!Invites.findOne({
        activity_id: activityId,
        invitee_email: invitee.email,
        type: Invites.INVITE_TYPE_ACTIVITY_EMAIL,
      });

      if (isAlreadyInvited) {
        // @TODO How to handle this scenario? Because now, we just skip to the next invitee
        // throw new Meteor.Error(403, 'email_is_already_invited_to_network');
        return;
      }

      let accessToken = Random.secret();

      let invite = {
        type: Invites.INVITE_TYPE_ACTIVITY_EMAIL,
        activity_id: activity._id,
        inviter_id: inviter._id,
        invitee_name: invitee.name,
        invitee_email: invitee.email,
        message: fields.message,
        access_token: accessToken,
        created_at: new Date(),
      };

      Invites.insert(invite);

      Event.emit(
        'invites.inserted.activity.by_email',
        inviter,
        partup,
        activity,
        invitee.email,
        invitee.name,
        fields.message,
        accessToken
      );
    });
  },

  /**
   * Invite an existing upper to an activity
   *
   * @param {string} activityId
   * @param {string} inviteeId
   * @param {string} searchQuery
   */
  'activities.invite_existing_upper': function(
    activityId,
    inviteeId,
    searchQuery
  ) {
    check(activityId, String);
    check(inviteeId, String);
    check(searchQuery, Match.Optional(String));

    let inviter = Meteor.user();
    if (!inviter) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    let activity = Activities.findOneOrFail(activityId);

    if (activity.isRemoved()) {
      throw new Meteor.Error(404, 'activity_could_not_be_found');
    }

    let invitee = Meteor.users.findOneOrFail(inviteeId);

    let isAllowedToAccessPartup =
      !!Partups.guardedFind(inviter._id, {
        _id: activity.partup_id,
      }).count() > 0;
    if (!isAllowedToAccessPartup) {
      throw new Meteor.Error(401, 'unauthorized');
    }

    let isAlreadyInvited = !!Invites.findOne({
      activity_id: activityId,
      invitee_id: invitee._id,
      inviter_id: inviter._id,
      type: Invites.INVITE_TYPE_ACTIVITY_EXISTING_UPPER,
    });
    if (isAlreadyInvited) {
      throw new Meteor.Error(403, 'user_is_already_invited_to_activity');
    }

    let invite = {
      type: Invites.INVITE_TYPE_ACTIVITY_EXISTING_UPPER,
      activity_id: activity._id,
      inviter_id: inviter._id,
      invitee_id: invitee._id,
      created_at: new Date(),
    };

    Invites.insert(invite);

    // Add to the invite list of the partup
    let partup = Partups.findOneOrFail(activity.partup_id);
    if (!partup.hasInvitedUpper(invitee._id)) {
      Partups.update(partup._id, { $addToSet: { invites: invitee._id } });
    }

    Event.emit(
      'invites.inserted.activity',
      inviter,
      partup,
      activity,
      invitee,
      searchQuery
    );
  },
});

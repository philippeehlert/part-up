/**
 * Create the update for the contribution
 */
Event.on('partups.contributions.inserted', function(userId, contribution) {
  if (!userId) return;

  let updateType = contribution.verified
    ? 'partups_contributions_added'
    : 'partups_contributions_proposed';
  let updateTypeData = {
    activity_id: contribution.activity_id,
    contribution_id: contribution._id,
  };

  let update = Partup.factories.updatesFactory.make(
    userId,
    contribution.partup_id,
    updateType,
    updateTypeData
  );
  let updateId = Updates.insert(update);

  Contributions.update(
    { _id: contribution._id },
    { $set: { update_id: updateId } }
  );

  let user = Meteor.users.findOneOrFail(userId);
  if (!user) return;

  let activity = Activities.findOneOrFail(contribution.activity_id);
  let system_message_type = contribution.verified
    ? 'system_contributions_added'
    : 'system_contributions_proposed';
  Partup.server.services.system_messages.send(
    user,
    activity.update_id,
    system_message_type,
    { update_timestamp: false }
  );

  let creator = Meteor.users.findOneOrFail(contribution.upper_id);

  // Make the user a supporter
  let partup = Partups.findOneOrFail(activity.partup_id);
  if (!partup.hasUpper(user._id)) {
    partup.makeSupporter(user._id);

    var notificationOptions = {
      type: 'partups_contributions_proposed',
      typeData: {
        creator: {
          _id: creator._id,
          name: creator.profile.name,
          image: creator.profile.image,
        },
        partup: {
          _id: partup._id,
          name: partup.name,
          slug: partup.slug,
        },
        update: {
          _id: activity.update_id,
        },
      },
    };

    // Send a notification to each partner of the partup
    var uppers = partup.uppers || [];
    uppers.forEach(function(partnerId) {
      if (userId === partnerId) return;
      notificationOptions.userId = partnerId;
      Partup.server.services.notifications.send(notificationOptions);
    });
  } else {
    var notificationOptions = {
      type: 'partups_contributions_inserted',
      typeData: {
        creator: {
          _id: creator._id,
          name: creator.profile.name,
          image: creator.profile.image,
        },
        partup: {
          _id: partup._id,
          name: partup.name,
          slug: partup.slug,
        },
        update: {
          _id: activity.update_id,
        },
      },
    };

    // Send a notification to each partner of the partup
    var uppers = partup.uppers || [];
    uppers.forEach(function(partnerId) {
      if (userId === partnerId) return;
      notificationOptions.userId = partnerId;
      Partup.server.services.notifications.send(notificationOptions);
    });

    // Send a notification to each supporter of the partup
    let supporters = partup.supporters || [];
    supporters.forEach(function(supporterId) {
      if (userId === supporterId) return;
      notificationOptions.userId = supporterId;
      Partup.server.services.notifications.send(notificationOptions);
    });
  }
});

/**
 * Change update_type of Update when the Contribution is changed
 */
Event.on('partups.contributions.updated', function(
  userId,
  contribution,
  oldContribution
) {
  if (!userId) return;
  if (!oldContribution.update_id) return;

  let cause = false;
  if (!oldContribution.archived && contribution.archived) {
    cause = 'archived';
  } else if (oldContribution.archived && !contribution.archived) {
    cause = 're-added';
  } else if (!oldContribution.verified && contribution.verified) {
    cause = 'verified';
  }

  let set = {
    upper_id: userId,
    type:
      cause === 're-added'
        ? 'partups_contributions_proposed'
        : 'partups_contributions_changed',
    updated_at: new Date(),
  };

  Updates.update({ _id: contribution.update_id }, { $set: set });

  let user = Meteor.users.findOneOrFail(userId);
  let activity = Activities.findOneOrFail(contribution.activity_id);

  // When there's a cause, it means that the system_message will be created somewhere else
  if (!cause) {
    Partup.server.services.system_messages.send(
      user,
      activity.update_id,
      'system_contributions_updated',
      { update_timestamp: false }
    );
  }

  if (cause === 're-added') {
    let system_message_type = contribution.verified
      ? 'system_contributions_added'
      : 'system_contributions_proposed';
    Partup.server.services.system_messages.send(
      user,
      activity.update_id,
      system_message_type,
      { update_timestamp: false }
    );
  }
});

/**
 * Change update_type of Update when the Contribution is archived
 */
Event.on('partups.contributions.archived', function(userId, contribution) {
  if (!userId) return;
  if (!contribution.update_id) return;

  let set = {
    upper_id: userId,
    type: 'partups_contributions_removed',
    updated_at: new Date(),
  };

  Updates.update({ _id: contribution.update_id }, { $set: set });

  let user = Meteor.users.findOneOrFail(userId);
  let activity = Activities.findOneOrFail(contribution.activity_id);
  Partup.server.services.system_messages.send(
    user,
    activity.update_id,
    'system_contributions_removed',
    { update_timestamp: false }
  );
});

/**
 * Generate a Notification for an Upper when his contribution(s) get(s) accepted
 */
Event.on('contributions.accepted', function(userId, activityId, upperId) {
  let activity = Activities.findOneOrFail(activityId);
  let partup = Partups.findOneOrFail(activity.partup_id);
  let accepter = Meteor.users.findOne(userId);

  let notificationOptions = {
    userId: upperId,
    type: 'partups_contributions_accepted',
    typeData: {
      accepter: {
        _id: accepter._id,
        name: accepter.profile.name,
        image: accepter.profile.image,
      },
      activity: {
        _id: activity._id,
        name: activity.name,
      },
      partup: {
        _id: partup._id,
        name: partup.name,
        slug: partup.slug,
      },
      update: {
        _id: activity.update_id,
      },
    },
  };

  Partup.server.services.notifications.send(notificationOptions);
});

/**
 * Generate a Notification for an Upper when his contribution gets rejected
 */
Event.on('contributions.rejected', function(userId, activityId, upperId) {
  let activity = Activities.findOneOrFail(activityId);
  let partup = Partups.findOneOrFail(activity.partup_id);
  let rejecter = Meteor.users.findOne(userId);

  let notificationOptions = {
    userId: upperId,
    type: 'partups_contributions_rejected',
    typeData: {
      rejecter: {
        _id: rejecter._id,
        name: rejecter.profile.name,
        image: rejecter.profile.image,
      },
      activity: {
        _id: activity._id,
        name: activity.name,
      },
      partup: {
        _id: partup._id,
        name: partup.name,
        slug: partup.slug,
      },
      update: {
        _id: activity.update_id,
      },
    },
  };

  Partup.server.services.notifications.send(notificationOptions);
});

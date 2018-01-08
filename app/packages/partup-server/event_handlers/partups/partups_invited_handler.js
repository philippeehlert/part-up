/**
 * Generate a notification and email when an invite gets sent
 */
Event.on('invites.inserted.partup', function(
  inviter,
  partup,
  invitee,
  searchQuery
) {
  if (!User(invitee).isActive()) return; // Ignore deactivated accounts

  // Check if there is already an invite update
  let inviteUpdate = Updates.findOne(
    {
      partup_id: partup._id,
      upper_id: inviter._id,
      type: 'partups_invited',
    },
    { sort: { updated_at: -1 } }
  );

  if (inviteUpdate && inviteUpdate.isLatestUpdateOfItsPartup()) {
    // Update the update with new invitee name
    let inviteeNames = inviteUpdate.type_data.invitee_names;
    inviteeNames.unshift(User(invitee).getFirstname());
    Updates.update(inviteUpdate._id, {
      $set: {
        'type_data.invitee_names': inviteeNames,
        'updated_at': new Date(),
      },
    });
  } else {
    // Create a new update
    let updateType = 'partups_invited';
    let updateTypeData = {
      invitee_names: [User(invitee).getFirstname()],
      invitee_ids: [invitee._id],
    };
    let update = Partup.factories.updatesFactory.make(
      inviter._id,
      partup._id,
      updateType,
      updateTypeData
    );
    Updates.insert(update);
  }

  // Set the notification details
  let notificationOptions = {
    userId: invitee._id,
    type: 'invite_upper_to_partup',
    typeData: {
      inviter: {
        _id: inviter._id,
        name: inviter.profile.name,
        image: inviter.profile.image,
      },
      partup: {
        _id: partup._id,
        name: partup.name,
        slug: partup.slug,
      },
    },
  };

  // Send notification
  Partup.server.services.notifications.send(notificationOptions);

  // set email fromAddress
  let fromAddress = Partup.constants.EMAIL_FROM.replace(
    /Part-up/,
    inviter.profile.name
  );

  // Set the email details
  let emailOptions = {
    type: 'invite_upper_to_partup',
    fromAddress:
      fromAddress + ' ' + TAPi18n.__('emails-invite_upper_to_partup-via'),
    toAddress: User(invitee).getEmail(),
    subject: TAPi18n.__(
      'emails-invite_upper_to_partup-subject',
      { inviter: inviter.profile.name, partup: partup.name },
      User(invitee).getLocale()
    ),
    locale: User(invitee).getLocale(),
    typeData: {
      name: User(invitee).getFirstname(),
      partupName: partup.name,
      partupDescription: partup.description,
      inviterName: inviter.profile.name,
      searchQuery: searchQuery,
      url: Meteor.absoluteUrl() + 'partups/' + partup.slug,
      unsubscribeOneUrl:
        Meteor.absoluteUrl() +
        'unsubscribe-email-one/invite_upper_to_partup/' +
        invitee.profile.settings.unsubscribe_email_token,
      unsubscribeAllUrl:
        Meteor.absoluteUrl() +
        'unsubscribe-email-all/' +
        invitee.profile.settings.unsubscribe_email_token,
    },
    userEmailPreferences: invitee.profile.settings.email,
  };

  // Send the email
  Partup.server.services.emails.send(emailOptions, invitee);

  // Update stats
  partup.increaseEmailShareCount();
});

/**
 * Generate an email when an invite gets sent
 */
Event.on('invites.inserted.partup.by_email', function(
  inviter,
  partup,
  email,
  name,
  message,
  accessToken
) {
  // Split by double newline
  let toParagraphs = function(message) {
    return message.split('\n\n');
  };

  // Interpolate email message (replace [name] with invitee name and [url] with partup url)
  let interpolate = function(message) {
    let url =
      Meteor.absoluteUrl() + 'partups/' + partup.slug + '?token=' + accessToken;

    return Partup.helpers.interpolateEmailMessage(message, {
      url: '<a href="' + url + '">' + url + '</a>',
      name: name,
    });
  };

  let fromAddress = Partup.constants.EMAIL_FROM.replace(
    /Part-up/,
    inviter.profile.name
  );

  // Set the email details
  let emailOptions = {
    type: 'invite_email_address_to_partup',
    fromAddress:
      fromAddress + ' ' + TAPi18n.__('emails-invite_upper_to_partup-via'),
    toAddress: email,
    subject: TAPi18n.__(
      'emails-invite_upper_to_partup-subject',
      { inviter: inviter.profile.name, partup: partup.name },
      User(inviter).getLocale()
    ),
    locale: User(inviter).getLocale(),
    typeData: {
      paragraphs: toParagraphs(interpolate(message)),
      partupName: partup.name,
      inviterName: inviter.profile.name,
    },
  };

  // Send the email
  Partup.server.services.emails.send(emailOptions);

  // Set the name that shows in the update
  let inviteeName = '';
  if (name.match(/.*\s.*/)) {
    inviteeName = name.split(' ')[0];
  } else {
    inviteeName = name;
  }
  // Capitalize first letter
  inviteeName =
    inviteeName.charAt(0).toUpperCase() +
    inviteeName.substring(1).toLowerCase();

  // Check if there is already an invite update
  let inviteUpdate = Updates.findOne(
    {
      partup_id: partup._id,
      upper_id: inviter._id,
      type: 'partups_invited',
    },
    { sort: { updated_at: -1 } }
  );

  if (inviteUpdate && inviteUpdate.isLatestUpdateOfItsPartup()) {
    // Update the update with new invitee name
    let inviteeNames = inviteUpdate.type_data.invitee_names;
    inviteeNames.unshift(inviteeName);
    Updates.update(inviteUpdate._id, {
      $set: {
        'type_data.invitee_names': inviteeNames,
        'updated_at': new Date(),
      },
    });
  } else {
    // Create a new update
    let updateType = 'partups_invited';
    let updateTypeData = {
      invitee_names: [inviteeName],
    };
    let update = Partup.factories.updatesFactory.make(
      inviter._id,
      partup._id,
      updateType,
      updateTypeData
    );
    Updates.insert(update);
  }

  // Save the access token to the partup to allow access
  Partups.update(partup._id, { $addToSet: { access_tokens: accessToken } });
});

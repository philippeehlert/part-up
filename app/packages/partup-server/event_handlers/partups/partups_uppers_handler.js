/**
 * Generate an Update in a Partup when there is a new Upper.
 */
Event.on('partups.uppers.inserted', function(partupId, upperId) {
  let updateType = 'partups_uppers_added';
  let updateTypeData = {};

  let update = Partup.factories.updatesFactory.make(
    upperId,
    partupId,
    updateType,
    updateTypeData
  );

  // TODO: Validation

  Updates.insert(update);
});

/**
 * Generate a notification for all partners when an upper makes a request
 */
Event.on('partups.partner_requested', function(requester, partup, updateId) {
  // Set base options
  let notificationOptions = {
    type: 'partups_partner_request',
    typeData: {
      requester: {
        _id: requester._id,
        name: requester.profile.name,
        image: requester.profile.image,
      },
      partup: {
        _id: partup._id,
        name: partup.name,
        slug: partup.slug,
      },
      update: {
        _id: updateId,
      },
    },
  };

  // Send to all partners
  partup.uppers.forEach(function(partnerId) {
    notificationOptions.userId = partnerId;
    Partup.server.services.notifications.send(notificationOptions);

    let partner = Meteor.users.findOne(partnerId);

    // Set the email details
    let emailOptions = {
      type: 'partups_partner_request',
      toAddress: User(partner).getEmail(),
      subject: TAPi18n.__(
        'emails-partups_partner_request-subject',
        { partup: partup.name },
        User(partner).getLocale()
      ),
      locale: User(partner).getLocale(),
      typeData: {
        name: User(partner).getFirstname(),
        requestingUpper: requester.profile.name,
        partupName: partup.name,
        url:
          Meteor.absoluteUrl() +
          'partups/' +
          partup.slug +
          '/updates/' +
          updateId,
        unsubscribeOneUrl:
          Meteor.absoluteUrl() +
          'unsubscribe-email-one/partups_partner_request/' +
          partner.profile.settings.unsubscribe_email_token,
        unsubscribeAllUrl:
          Meteor.absoluteUrl() +
          'unsubscribe-email-all/' +
          partner.profile.settings.unsubscribe_email_token,
      },
      userEmailPreferences: partner.profile.settings.email,
    };

    // Send the email
    Partup.server.services.emails.send(emailOptions, partner);
  });
});

/**
 * Generate a notification for an upper when getting accepted as partner
 */
Event.on('partups.partner_request.accepted', function(
  accepter,
  partup,
  upperId,
  updateId
) {
  let notificationOptions = {
    userId: upperId,
    type: 'partups_partner_accepted',
    typeData: {
      accepter: {
        _id: accepter._id,
        name: accepter.profile.name,
        image: accepter.profile.image,
      },
      partup: {
        _id: partup._id,
        name: partup.name,
        slug: partup.slug,
      },
      update: {
        _id: updateId,
      },
    },
  };

  Partup.server.services.notifications.send(notificationOptions);
});

/**
 * Generate a notification for an upper when getting rejected as partner
 */
Event.on('partups.partner_request.rejected', function(
  rejecter,
  partupId,
  upperId,
  updateId
) {
  let partup = Partups.findOneOrFail(partupId);

  let notificationOptions = {
    userId: upperId,
    type: 'partups_partner_rejected',
    typeData: {
      rejecter: {
        _id: rejecter._id,
        name: rejecter.profile.name,
        image: rejecter.profile.image,
      },
      partup: {
        _id: partup._id,
        name: partup.name,
        slug: partup.slug,
      },
      update: {
        _id: updateId,
      },
    },
  };

  Partup.server.services.notifications.send(notificationOptions);
});

/**
 * Generate a notification and email when an invite gets sent
 */
Event.on('invites.inserted.network', function(
  inviter,
  network,
  invitee,
  searchQuery
) {
  if (!User(invitee).isActive()) return; // Ignore deactivated accounts

  // Set the notification details
  let notificationOptions = {
    userId: invitee._id,
    type: 'partups_networks_invited',
    typeData: {
      inviter: {
        _id: inviter._id,
        name: inviter.profile.name,
        image: inviter.profile.image,
      },
      network: {
        _id: network._id,
        name: network.name,
        image: network.image,
        slug: network.slug,
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
    type: 'invite_upper_to_network',
    fromAddress:
      fromAddress + ' ' + TAPi18n.__('emails-invite_upper_to_network-via'),
    toAddress: User(invitee).getEmail(),
    subject: TAPi18n.__(
      'emails-invite_upper_to_network-subject',
      { inviter: inviter.profile.name, network: network.name },
      User(invitee).getLocale()
    ),
    locale: User(invitee).getLocale(),
    typeData: {
      name: User(invitee).getFirstname(),
      networkName: network.name,
      networkDescription: network.description,
      inviterName: inviter.profile.name,
      searchQuery: searchQuery,
      url: Meteor.absoluteUrl() + 'tribes/' + network.slug,
      unsubscribeOneUrl:
        Meteor.absoluteUrl() +
        'unsubscribe-email-one/invite_upper_to_network/' +
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
});

/**
 * Generate an email when an invite gets sent
 */
Event.on('invites.inserted.network.by_email', function(
  inviter,
  network,
  email,
  name,
  message,
  accessToken
) {
  // Split by double newline
  let toParagraphs = function(message) {
    return message.split('\n\n');
  };

  // Interpolate email message (replace [name] with invitee name and [url] with network url)
  let interpolate = function(message) {
    let url =
      Meteor.absoluteUrl() + 'tribes/' + network.slug + '?token=' + accessToken;

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
    type: 'invite_email_address_to_network',
    fromAddress:
      fromAddress + ' ' + TAPi18n.__('emails-invite_upper_to_network-via'),
    toAddress: email,
    subject: TAPi18n.__(
      'emails-invite_upper_to_network-subject',
      { inviter: inviter.profile.name, network: network.name },
      User(inviter).getLocale()
    ),
    locale: User(inviter).getLocale(),
    typeData: {
      paragraphs: toParagraphs(interpolate(message)),
    },
  };

  // Send the email
  Partup.server.services.emails.send(emailOptions);
});

let d = Debug('accounts');

Accounts.validateLoginAttempt(function(attempt) {
  let user = attempt.user;
  if (user && !User(user).isActive()) {
    throw new Meteor.Error(403, 'User is deactivated');
  }
  return true;
});

Accounts.onLogin(function(data) {
  Meteor.defer(function() {
    let user = data.user;
    User(user).pruneDevices();

    let logins = user.logins || [];

    d('User [' + user._id + '] has logged in');

    let now = new Date();
    let todayFormatted = now.toISOString().slice(0, 10);
    let daysLoggedInFormatted = logins.map(function(login) {
      return login.toISOString().slice(0, 10);
    });

    let userAlreadyLoggedInToday =
      daysLoggedInFormatted.indexOf(todayFormatted) > -1;

    if (!userAlreadyLoggedInToday) {
      // We are using the extended $push syntax, $slice with a negative
      // number means we save the latest x amount of items.
      Meteor.users.update(
        { _id: user._id },
        { $push: { logins: { $each: [now], $slice: -25 } } }
      );
      d('User [' + user._id + '] first login today, saving');
    } else {
      d('User [' + user._id + '] already logged in earlier today, not saving');
    }
  });
});

Accounts.afterLogout(function(userId) {
  let user = Meteor.users.findOne(userId);
  if (user) {
    User(user).pruneDevices();
  }
});

let defaultEmailObject = {
  dailydigest: true,
  upper_mentioned_in_partup: true,
  invite_upper_to_partup_activity: true,
  invite_upper_to_network: true,
  partup_created_in_network: true,
  partups_networks_new_pending_upper: true,
  partups_networks_accepted: true,
  invite_upper_to_partup: true,
  partups_new_comment_in_involved_conversation: true,
  partups_networks_new_upper: true,
  partups_networks_upper_left: true,
  upper_mentioned_in_network_chat: true,
  partups_partner_request: true,
};

Accounts.onCreateUser(function(options, user) {
  let imageUrl;

  var sanitizedName = options.profile.name;
  let profile = {
    name: sanitizedName,
    normalized_name: sanitizedName
      ? Partup.helpers.normalize(sanitizedName)
      : '',
    settings: {
      locale: mout.object.get(options, 'profile.settings.locale') || 'en',
      optionalDetailsCompleted: false,
      email: defaultEmailObject,
      unsubscribe_email_token: Random.secret(),
    },
  };

  let liData = mout.object.get(user, 'services.linkedin');
  let fbData = mout.object.get(user, 'services.facebook');

  user.emails = user.emails || [];

  d('User registration detected, creating a new user');

  if (liData) {
    d('User used LinkedIn to register');

    let location = {};

    if (liData.location && liData.location.name) {
      let locationParts = liData.location.name.split(',');

      if (locationParts.length === 2) {
        location.city = locationParts[0].trim().replace(' Area', '');
        location.country = locationParts[1].trim();
      }
    }

    var sanitizedName = liData.firstName + ' ' + liData.lastName;

    profile = {
      firstname: liData.firstName,
      lastname: liData.lastName,
      location: location,
      linkedin_url: 'https://linkedin.com/profile/view?id=' + liData.id,
      name: sanitizedName,
      normalized_name: Partup.helpers.normalize(sanitizedName),
      settings: {
        locale: 'en',
        optionalDetailsCompleted: false,
        email: defaultEmailObject,
        unsubscribe_email_token: Random.secret(),
      },
    };

    imageUrl = liData.pictureUrl;
    user.emails.push({ address: liData.emailAddress, verified: true });
  }

  if (fbData) {
    d('User used Facebook to register');

    profile = {
      firstname: fbData.first_name,
      gender: fbData.gender,
      lastname: fbData.last_name,
      facebook_url: 'https://facebook.com/' + fbData.id,
      name: fbData.name,
      normalized_name: Partup.helpers.normalize(fbData.name),
      settings: {
        locale: Partup.helpers.parseLocale(fbData.locale),
        optionalDetailsCompleted: false,
        email: defaultEmailObject,
        unsubscribe_email_token: Random.secret(),
      },
    };

    imageUrl = 'https://graph.facebook.com/' + fbData.id + '/picture?width=750';
    user.emails.push({ address: fbData.email, verified: true });
  }

  try {
    let result = HTTP.get(imageUrl, {
      npmRequestOptions: { encoding: null },
    });
    let body = new Buffer(result.content, 'binary');
    var image = Partup.server.services.images.upload(
      user._id + '.jpg',
      body,
      'image/jpeg'
    );

    profile.image = image._id;
  } catch (error) {
    Log.error(error.message);
  }

  if (!profile.image) {
    d(
      'Registered user has no image so far, using one of the default profile pictures'
    );

    let images = Images.find({
      'meta.default_profile_picture': true,
    }).fetch();
    image = mout.random.choice(images);
    profile.image = image._id;
  }

  user.profile = profile;
  user.completeness = Partup.server.services.profile_completeness.updateScore(
    user
  );
  user.flags = {
    dailyDigestEmailHasBeenSent: false,
  };

  // NOTE: replaced heavy and errorprone get_locale call with fallback
  if (!user.profile.settings.locale) {
    user.profile.settings.locale = 'nl';
  }

  return user;
});

Accounts.validateNewUser(function(user) {
  let emailAddress = User(user).getEmail();

  let socialUser = Meteor.users.findOne({ 'emails.address': emailAddress });
  let passwordUser = Meteor.users.findOne({
    'registered_emails.address': emailAddress,
  });

  if (socialUser) {
    if (socialUser.services.facebook) {
      throw new Meteor.Error(409, 'user-registered-with-facebook');
    }
    if (socialUser.services.linkedin) {
      throw new Meteor.Error(409, 'user-registered-with-linkedin');
    }
  }

  if (passwordUser) {
    throw new Meteor.Error(409, 'user-registered-with-username-and-password');
  }

  let liData = mout.object.get(user, 'services.linkedin');
  let fbData = mout.object.get(user, 'services.facebook');
  if (!liData && !fbData) {
    Meteor.setTimeout(function() {
      d(
        'User registered with username and password, sending verification email'
      );
      Accounts.sendVerificationEmail(user._id);
    }, 5000);
  }

  Event.emit('users.inserted', user);

  return true;
});

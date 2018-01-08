let respondWithError = function(response, statusCode, reason) {
  response.statusCode = statusCode;
  response.end(JSON.stringify({ error: { reason: reason } }));
};

/**
 * Find the user and set it on the request
 */
Router.onBeforeAction(
  function(request, response, next) {
    let token = request.query.token;

    if (token) {
      let user = Meteor.users.findOne({
        $or: [
          {
            'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(
              token
            ),
          },
          { 'services.resume.loginTokens.token': token },
        ],
      });

      if (user) request.user = user;
    }

    next();
  },
  { where: 'server' }
);

/**
 * Require authentication for certain server-side routes
 */
Router.onBeforeAction(
  function(request, response, next) {
    if (!request.user) {
      return respondWithError(response, 401, 'error-http-unauthorized');
    }

    next();
  },
  {
    where: 'server',
    except: [
      'ping',
      'partups.start',
      'partups.discover',
      'partups.discover.count',
      'networks.discover',
      'networks.discover.count',
      'networks.:slug.partups.count',
      'networks.:slug.uppers.count',
      'users.count',
      'users.:id.upperpartups.count',
      'users.:id.supporterpartups.count',
      'users.:id.upperpartups',
      'users.:id.supporterpartups',
      'users.:id.networks',
      'users.:id.partners',
      'users.:id.partners.count',
      'sitemap.xml',
      'default.xml',
      'tribes.xml',
      'part-ups.xml',
      'profiles.xml',
      'swarms.xml',
    ],
  }
);

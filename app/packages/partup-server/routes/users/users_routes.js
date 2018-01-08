/*
 * Count route for /users
 */
Router.route('/users/count', { where: 'server' }).get(function() {
  let request = this.request;
  let response = this.response;

  // We are going to respond in JSON format
  response.setHeader('Content-Type', 'application/json');

  return response.end(
    JSON.stringify({ error: false, count: Meteor.users.find().count() })
  );
});

/*
 * Count route for /users/:id/upperpartups
 */
Router.route('/users/:id/upperpartups/count', { where: 'server' }).get(
  function() {
    let request = this.request;
    let response = this.response;
    let params = this.params;

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    let parameters = {
      limit: request.query.limit,
      skip: request.query.skip,
      archived: request.query.archived || false,
    };

    parameters.archived = request.query.archived
      ? JSON.parse(request.query.archived)
      : false;

    let userId = request.user ? request.user._id : null;

    let user = Meteor.users.findOne(params.id);
    if (!user) {
      response.statusCode = 404;
      return response.end(
        JSON.stringify({ error: { reason: 'error-user-notfound' } })
      );
    }

    let partups = Partups.findUpperPartupsForUser(user, parameters, userId);

    return response.end(
      JSON.stringify({ error: false, count: partups.count() })
    );
  }
);

/*
 * Count route for /users/:id/supporterpartups
 */
Router.route('/users/:id/supporterpartups/count', { where: 'server' }).get(
  function() {
    let request = this.request;
    let response = this.response;
    let params = this.params;

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    let parameters = {
      limit: request.query.limit,
      skip: request.query.skip,
      archived: request.query.archived || false,
    };

    parameters.archived = request.query.archived
      ? JSON.parse(request.query.archived)
      : false;

    let userId = request.user ? request.user._id : null;

    let user = Meteor.users.findOne(params.id);
    if (!user) {
      response.statusCode = 404;
      return response.end(
        JSON.stringify({ error: { reason: 'error-user-notfound' } })
      );
    }

    let partups = Partups.findSupporterPartupsForUser(user, parameters, userId);

    return response.end(
      JSON.stringify({ error: false, count: partups.count() })
    );
  }
);

/*
 * Count route for /users/:id/partners
 */
Router.route('/users/:id/partners/count', { where: 'server' }).get(function() {
  let response = this.response;
  let params = this.params;

  // We are going to respond in JSON format
  response.setHeader('Content-Type', 'application/json');

  let user = Meteor.users.findOne(params.id);
  if (!user) {
    response.statusCode = 404;
    return response.end(
      JSON.stringify({ error: { reason: 'error-user-notfound' } })
    );
  }

  let partners = Meteor.users.findPartnersForUpper(user);

  return response.end(
    JSON.stringify({ error: false, count: partners.count() })
  );
});

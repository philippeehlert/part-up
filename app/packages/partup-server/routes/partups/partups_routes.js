/*
 * Count route for /partups/discover
 */
Router.route('/partups/discover/count', { where: 'server' }).get(function() {
  let request = this.request;
  let response = this.response;

  // We are going to respond in JSON format
  response.setHeader('Content-Type', 'application/json');

  let parameters = {
    networkId: request.query.networkId,
    locationId: request.query.locationId,
    sort: request.query.sort,
    textSearch: request.query.textSearch,
    limit: request.query.limit,
    skip: request.query.skip,
    language:
      request.query.language === 'all' ? undefined : request.query.language,
  };

  let userId = request.user ? request.user._id : null;
  let partups = Partups.findForDiscover(userId, {}, parameters);

  return response.end(JSON.stringify({ error: false, count: partups.count() }));
});

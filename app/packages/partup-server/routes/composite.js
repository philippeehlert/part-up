Meteor.routeComposite = function(route, callback) {
  Router.route(route, { where: 'server' }).get(function() {
    let request = this.request;
    let response = this.response;
    let params = this.params;

    let userId = request.user ? request.user._id : null;
    delete params.query.token;

    let composition = callback(request, _.extend({}, params));
    let result = compositionToResult(
      userId,
      composition.find.bind({ userId: userId }),
      composition.children
    );

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');

    return response.end(JSON.stringify(result));
  });
};

var compositionToResult = function(userId, find, children) {
  let result = {};

  let cursor = find();
  if (!cursor) return;

  let documents = cursor.fetch();
  let collectionName = cursor._cursorDescription.collectionName;

  documents.forEach(function(document) {
    result[collectionName] = result[collectionName] || [];
    result[collectionName].push(document);

    if (children) {
      children.forEach(function(childComposition) {
        let r = compositionToResult(
          userId,
          childComposition.find.bind({ userId: userId }, document),
          childComposition.children
        );

        if (r) {
          Object.keys(r).forEach(function(collectionName) {
            result[collectionName] = result[collectionName] || [];

            let documents = r[collectionName];

            documents.forEach(function(document) {
              result[collectionName].push(document);
            });
          });
        }
      });
    }
  });

  return result;
};

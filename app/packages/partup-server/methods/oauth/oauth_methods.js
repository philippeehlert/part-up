let provisionKey = process.env.API_PROVISION_KEY;
let kongAdminUrl = process.env.KONG_ADMIN_URL;

if (
  !provisionKey &&
  (!process.env.NODE_ENV.match(/development|staging/) || !kongAdminUrl)
) {
  console.error('No OAuth Provision Key set, please set API_PROVISION_KEY...');
}

function obtainProvisionKeyFromKongAdminApi() {
  let url = Npm.require('url');
  let response = HTTP.get(url.resolve(kongAdminUrl, '/apis/root_api/plugins'));
  let plugins = response.data.data;
  provisionKey = _.find(plugins, { name: 'oauth2' }).config.provision_key;
}

Meteor.methods({
  'oauth.applications.find': function(clientId) {
    if (!clientId) {
      throw new Meteor.Error(400, 'Client Id is required.');
    }
    this.unblock();
    try {
      let response = Api.get('/kong/oauth2', {
        params: { client_id: clientId },
      });
      let data = response.data.data;
      if (data && data.length > 0) {
        let consumer = _.find(data, { client_id: clientId });
        if (consumer) {
          return {
            name: consumer.name,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      Log.error('Client Id Query failed', error);
      return null;
    }
  },
  'oauth.grant': function(clientId, state) {
    if (
      !provisionKey &&
      process.env.NODE_ENV.match(/development|staging/) &&
      kongAdminUrl
    ) {
      this.unblock();
      Log.info(
        'Provision key not set, attempting to obtain from Kong Admin API...'
      );
      obtainProvisionKeyFromKongAdminApi();
    }
    let userId = Meteor.userId();
    if (userId) {
      let payload = {
        client_id: clientId,
        response_type: 'code',
        scope: 'openid',
        provision_key: provisionKey,
        authenticated_userid: userId,
      };
      if (state) {
        payload.state = state;
      }
      this.unblock();
      try {
        let headers = Api.isSecure() ? {} : { 'x-forwarded-proto': 'https' };
        let response = Api.post('/oauth2/authorize', {
          data: payload,
          headers: headers,
        });
        return response.data.redirect_uri;
      } catch (error) {
        Log.error('Grant failed', error);
        return null;
      }
    } else {
      return null;
    }
  },
});

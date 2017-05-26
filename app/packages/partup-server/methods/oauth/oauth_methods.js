var provisionKey = process.env.API_PROVISION_KEY;
var kongAdminUrl = process.env.KONG_ADMIN_URL;

if (!provisionKey && (!process.env.NODE_ENV.match(/development|staging/) || !kongAdminUrl)) {
    console.error('No OAuth Provision Key set, please set API_PROVISION_KEY...');
}

function obtainProvisionKeyFromKongAdminApi() {
    var url = Npm.require('url');
    var response = HTTP.get(url.resolve(kongAdminUrl, '/apis/root_api/plugins'));
    var plugins = response.data.data;
    provisionKey = _.find(plugins, { name: 'oauth2' }).config.provision_key;
}

Meteor.methods({
    'oauth.applications.find': function(clientId) {
        this.unblock();
        try {
            var response = Api.get('/kong/oauth2', { params: { client_id: clientId } });
            var data = response.data.data;
            if (data && data.length > 0) {
                return {
                    name: data[0].name
                };
            } else {
                return null;
            }
        } catch (error) {
            Log.error('Client Id Query failed', error);
            return null;
        }
    },
    'oauth.grant': function(clientId) {
        if (!provisionKey && process.env.NODE_ENV.match(/development|staging/) && kongAdminUrl) {
            this.unblock();
            Log.info('Provision key not set, attempting to obtain from Kong Admin API...');
            obtainProvisionKeyFromKongAdminApi();
        }
        var userId = Meteor.userId();
        if (userId) {
            var payload = {
                client_id: clientId,
                response_type: 'code',
                scope: 'openid',
                provision_key: provisionKey,
                authenticated_userid: userId
            };
            this.unblock();
            try {
                var headers = Api.isSecure() ? {} : { 'x-forwarded-proto': 'https' };
                var response = Api.post('/oauth2/authorize', { data: payload, headers: headers });
                return response.data.redirect_uri;
            } catch (error) {
                Log.error('Grant failed', error);
                return null;
            }
        } else {
            return null;
        }
    }
});
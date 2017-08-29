import _ from 'lodash';
import httpGet from './requests';

/**
 * The MenuStateManager is only to be used by the ./tribes.js template and heavily reliant on it's properties.
 */

export default MenuStateMager = {
	// lastRefresh: 0,
	update(template) {

        const user = Meteor.user();
        httpGet.getForMenu(template);
	},
};

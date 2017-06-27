import _ from 'lodash';
import httpGet from './requests';

/**
 * The MenuStateManager is only to be used by the ./tribes.js template and heavily reliant on it's properties.
 */

const getIds = arr => {
	return _.map(arr, x => x._id);
};
const findInCollection = col => ids => {
	return _.filter(col, x => ids.indexOf(x._id) !== -1);
};
const filterFromCollection = col => ids => {
	return _.filter(col, x => ids.indexOf(x._id) === -1);
};
const copyFromTo = from => to => ids => {
	if (!ids || ids.length < 1) {
		return;
	}
	const hasInFrom = findInCollection(from.get())(ids);
	to.set(_.unionBy(to.get(), hasInFrom, x => x._id));
};

export default MenuStateMager = {
	updatePartups(template, user) {

		const templateUpperPartups = template.results.upperPartups;
		const templateSupporterPartups = template.results.supporterPartups;

		const userUpperPartupIds = user.upperOf || [];
		const templateUpperPartupIds = () => getIds(templateUpperPartups.get());

		const userSupporterPartupIds = user.supporterOf || [];
		const templateSupporterPartupIds = () => getIds(templateSupporterPartups.get());

		// If it's the first call the server knows which partups the user belongs to, this saves sending the ids in the request.
		if (_.concat(templateUpperPartupIds, templateSupporterPartupIds).length === 0 
			&& _.concat(userUpperPartupIds, userSupporterPartupIds).length !== 0) {
			template.loadingPartups.set(true);
			httpGet.Partups(template, template.query);
			return;
		}

		let partupIdsToGet = [];

		// Check which new upper id's the user has.
		const newUserUpperIds = _.difference(userUpperPartupIds, templateUpperPartupIds());
		if (newUserUpperIds.length > 0) {
			// Check if the id's exist in the supporter array (swithced roles) and copy them if possible.
			copyFromTo(templateSupporterPartups)(templateUpperPartups)(newUserUpperIds);

			const upperIds = _.difference(newUserUpperIds, templateSupporterPartupIds());
			if (upperIds.length > 0) {
				template.loadingUpperPartups.set(true);
			}
			// All new unique id's get unioned to the query ids array.
			partupIdsToGet = _.union(partupIdsToGet, upperIds);
		}

		// Check which new supporter id's the user has.
		const newUserSupporterIds = _.difference(userSupporterPartupIds, templateSupporterPartupIds);
		if (newUserSupporterIds.length > 0) {
			// Check if the id's exist in the upper array (swithced roles) and copy them if possible.
			copyFromTo(templateUpperPartups)(templateSupporterPartups)(newUserSupporterIds);

			const supporterIds = _.difference(newUserSupporterIds, templateUpperPartupIds());
			if (supporterIds.length > 0) {
				template.loadingSupporterPartups.set(true);
			}
			// All new unique id's get unioned to the query ids array.
			partupIdsToGet = _.union(partupIdsToGet, supporterIds);
		}

		// After adding possible new Id's to the right template arrays we can check if the template has more Id's than the user which need to be removed.
		// This happens after switching roles or leaving the part-up alltogether.

		// Check for upper partup ids on template that are not on the user.
		const extraTemplateUpperIds = _.difference(templateUpperPartupIds(), userUpperPartupIds);
		if (extraTemplateUpperIds.length > 0) {
			templateUpperPartups.set(filterFromCollection(templateUpperPartups.get())(extraTemplateUpperIds));
		}

		// Check for supporter partup ids on template that are not on the user.
		const extraTemplateSupporterIds = _.difference(templateSupporterPartupIds(), userSupporterPartupIds);
		if (extraTemplateSupporterIds.length > 0) {
			templateSupporterPartups.set(filterFromCollection(templateSupporterPartups.get())(extraTemplateSupporterIds));
		}

		// The reason the call thisis last is because you don't know when it will return.
		// calling it before setting the template arrays could cause a race condition if the result from the request get's set before the removal above.
		// don't know if that's even possible but just to be safe.
		if (partupIdsToGet.length > 0) {
			template.loadingPartups.set(true);
			httpGet.Partups(template, { ...template.query, ids: JSON.stringify(partupIdsToGet) });
		} else {
			// This triggers the networks call even if there are no part-ups to be called,
			// it might just be the user only joined a network.
			template.loadingPartups.set(false);
		}
	},
	updateNetworks(template, user) {

		const userNetworkIds = user.networks || [];
		const partupNetworkIds = _.union(_.concat(
			_.map(template.results.upperPartups.get(), x => x.network_id)
			, _.map(template.results.supporterPartups.get(), x => x.network_id)));
		const totalNetworkIds = _.union(userNetworkIds, partupNetworkIds);

		const templateNetworks = template.results.networks;
		const templateNetworkIds = getIds(templateNetworks.get());

		const extraTemplateNetworkIds = _.difference(templateNetworkIds, totalNetworkIds);
		if (extraTemplateNetworkIds.length > 0) {
			templateNetworks.set(filterFromCollection(templateNetworks.get())(extraTemplateNetworkIds));
		}

		const query = {
			...template.query
		}
		let networksToGet = _.difference(totalNetworkIds, templateNetworkIds);

		if (templateNetworkIds.length === 0 && _.difference(networksToGet, userNetworkIds).length === 0) {

			template.loadingNetworks.set(true);
			httpGet.Networks(template, query);

		} else if (networksToGet.length > 0) {

			query.ids = JSON.stringify(networksToGet);
			template.loadingNetworks.set(true);
			httpGet.Networks(template, query);

		}
	}
};

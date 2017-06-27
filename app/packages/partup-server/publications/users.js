import { _ } from 'lodash';

/**
 * Publish a user
 *
 * @param {String} userId
 */
Meteor.publishComposite('users.one', function (userId) {
	check(userId, String);

	this.unblock();

	return {
		find: function () {
			return Meteor.users.findSinglePublicProfile(userId);
		},
		children: [
			{ find: Images.findForUser }
		]
	};
});

Meteor.routeComposite('/users/me/menu/partups', function (request, params) {

	const options = parseDefaultOptions(params.query);
	options.fields = {
		name: 1,
		network_id: 1,
		slug: 1,
		image: 1,
		// upper_data: [user._id] // For notifications
	}

	return {
		find: function () {
			const user = Meteor.users.findOne(this.userId, { fields: { _id: 1, upperOf: 1, supporterOf: 1 } });
			const partupsToGet = options.ids
				? JSON.parse(options.ids)
				: user.upperOf
					? user.upperOf.concat(user.supporterOf || [])
					: user.supporterOf || [];

			return Partups.guardedFind(user._id, { _id: { $in: partupsToGet } }, options);
		},
		children: [
			{ find: Images.findForPartup }
		]
	}
});

Meteor.routeComposite('/users/me/menu/networks', function (request, params) {

	const options = parseDefaultOptions(params.query);
	delete options.archived;
	options.fields = {
		_id: 1,
		name: 1,
		slug: 1,
		image: 1,
		uppers: 1
	}

	return {
		find: function () {
			const user = Meteor.users.findOne(this.userId, { fields: { networks: 1 } });
			const networksToGet = options.ids
				? JSON.parse(options.ids)
				: user.networks || [];
			return Networks.guardedFind(user._id, { $and: [{ _id: { $in: networksToGet } }, { archived_at: { $exists: false } }] }, options);
		},
		children: [
			{ find: Images.findForNetwork }
		]
	}
});

/**
 * Publish all partups a user is upper in
 *
 * @param {Object} request
 * @param {Object} params
 */
Meteor.routeComposite('/users/:id/upperpartups', function (request, params) {
	var options = {};
	var skip = 0;
	var limit = 100;

	if (request.query) {
		if (request.query.limit) limit = parseInt(request.query.limit);
		if (request.query.skip) skip = parseInt(request.query.skip);
		if (request.query.archived) options.archived = JSON.parse(request.query.archived);
	}

	return {
		find: function () {
			var user = Meteor.users.findOne(params.id);
			if (!user) return;

			const getUpdatesCountForUser = function (partup) {
				const upperData = partup.upper_data.find(function (ud) { return ud._id === user._id; });
				return upperData ? upperData.new_updates.length : 0;
			};

			var result = Partups.findUpperPartupsForUser(user, options, this.userId)
				.fetch()
				.sort(function (a, b) {
					return getUpdatesCountForUser(b) - getUpdatesCountForUser(a);
				})
				.slice(skip, skip + limit);

			// Fake cursor for routeComposite
			return {
				fetch: function () {
					return result;
				},
				_cursorDescription: {
					collectionName: 'partups'
				}
			};
		},
		children: [
			{ find: Images.findForPartup },
			{
				find: Meteor.users.findUppersForPartup, children: [
					{ find: Images.findForUser }
				]
			},
			{
				find: function (partup) { return Networks.findForPartup(partup, this.userId); },
				children: [
					{ find: Images.findForNetwork }
				]
			}
		]
	};
});

/**
 * Publish all partups a user is supporter of
 *
 * @param {Object} request
 * @param {Object} params
 */
Meteor.routeComposite('/users/:id/supporterpartups', function (request, params) {
	var options = {};
	var skip = 0;
	var limit = 100;

	if (request.query) {
		if (request.query.limit) limit = parseInt(request.query.limit);
		if (request.query.skip) skip = parseInt(request.query.skip);
		if (request.query.archived) options.archived = JSON.parse(request.query.archived);
	}

	return {
		find: function () {
			var user = Meteor.users.findOne(params.id);
			if (!user) return;

			const getUpdatesCountForUser = function (partup) {
				const upperData = partup.upper_data.find(function (ud) { return ud._id === user._id; });
				return upperData ? upperData.new_updates.length : 0;
			};

			var result = Partups.findSupporterPartupsForUser(user, options, this.userId)
				.fetch()
				.sort(function (a, b) {
					return getUpdatesCountForUser(b) - getUpdatesCountForUser(a);
				})
				.slice(skip, skip + limit);

			// Fake cursor for routeComposite
			return {
				fetch: function () {
					return result;
				},
				_cursorDescription: {
					collectionName: 'partups'
				}
			};
		},
		children: [
			{ find: Images.findForPartup },
			{
				find: Meteor.users.findUppersForPartup, children: [
					{ find: Images.findForUser }
				]
			},
			{ find: Meteor.users.findSupportersForPartup },
			{
				find: function (partup) { return Networks.findForPartup(partup, this.userId); },
				children: [
					{ find: Images.findForNetwork }
				]
			}
		]
	};
});



/**
 * Publish all networks a user is in
 *
 * @param {Object} request
 * @param {Object} params
 */
Meteor.routeComposite('/users/:id/networks', function (request, params) {
	var options = {
		sort: {
			name: 1
		}
	};

	if (request.query) {
		if (request.query.limit) options.limit = parseInt(request.query.limit);
		if (request.query.skip) options.skip = parseInt(request.query.skip);
	}

	return {
		find: function () {
			return Meteor.users.find(params.id, { fields: { networks: 1 } });
		},
		children: [
			{
				find: function (user) {
					return Networks.findUnarchivedForUser(user, this.userId, options);
				},
				children: [
					{ find: Images.findForNetwork }
				]
			}
		]
	};

});

/**
 * Publish all partners a user worked with
 *
 * @param {Object} request
 * @param {Object} params
 */
Meteor.routeComposite('/users/:id/partners', function (request, params) {
	var options = {};

	if (request.query) {
		if (request.query.limit) options.limit = parseInt(request.query.limit);
		if (request.query.skip) options.skip = parseInt(request.query.skip);
	}

	return {
		find: function () {
			var user = Meteor.users.findOne({ _id: params.id });
			return Meteor.users.findPartnersForUpper(user, options, { sortByPartnerFrequency: true });
		},
		children: [{ find: Images.findForUser }]
	};
});

/**
 * Publish the loggedin user
 */
Meteor.publishComposite('users.loggedin', function () {
	return {
		find: function () {
			if (this.userId) {
				return Meteor.users.findSinglePrivateProfile(this.userId);
			} else {
				this.ready();
			}
		},
		children: [
			{ find: Images.findForUser }
		]
	};
});

/**
 * Publish multiple users by ids
 *
 * @param {[String]} userIds
 */
Meteor.publishComposite('users.by_ids', function (userIds) {
	check(userIds, [String]);

	this.unblock();

	return {
		find: function () {
			return Meteor.users.findMultiplePublicProfiles(userIds);
		},
		children: [
			{ find: Images.findForUser },
			{ find: Invites.findForUser }
		]
	};
});

/**
 * Publish public network admin profiles by network slug
 *
 * @param {String} networkSlug
 */
Meteor.publishComposite('admins.by_network_slug', function (networkSlug) {
	check(networkSlug, String);

	this.unblock();

	var network = Networks.findOne({ slug: networkSlug });

	return {
		find: function () {
			return Meteor.users.findMultipleNetworkAdminProfiles(network.admins);
		},
		children: [
			{ find: Images.findForUser }
		]
	};
});

function parseDefaultOptions(options) {
	if (!options) return {};

	if (options.limit) options.limit = parseInt(options.limit);
	if (options.skip) options.skip = parseInt(options.skip);
	if (options.archived) options.archived = JSON.parse(options.archived);

	return options;
}
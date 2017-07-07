import _ from 'lodash';

// Ideally you want to use promises for these requests but I'm unsure how to do this with compatibility in IE.

export default httpGet = {
	getForMenu(template) {

		if (!Meteor.userId()) {
			return;
		}
		HTTP.get(`/users/${Meteor.userId()}/menu` + mout.queryString.encode(template.query), function (error, response) {

			if (error || !response.data) {
				return;
			}
			const result = response.data;
			const user = result.users[0];

			if (result.networks && result.networks.length > 0) {
				template.results.networks.set(
						_.map(result.networks, network => Partup.client.embed.network(network, result['cfs.images.filerecord']))
							.map(network => _.assign({}, network, { uppers: [Meteor.user()._id] }))
				);
			} else {
				template.loadingNetworks.set(false);
			}

			if (result.partups && result.partups.length > 0) {
				const upperpartups = [];
				const supporterpartups = [];

				_.forEach(
					_.map(result.partups, partup => Partup.client.embed.partup(partup, result['cfs.images.filerecord'])), partup => {
						if (user.upperOf && user.upperOf.find(id => id === partup._id)) {
							upperpartups.push(partup);
						}
						if (user.supporterOf && user.supporterOf.find(id => id === partup._id)) {
							supporterpartups.push(partup);
						}
					});

				template.results.upperPartups.set(upperpartups);
				template.results.supporterPartups.set(supporterpartups);
			} else {
				template.loadingUpperPartups.set(false);
				template.loadingSupporterPartups.set(false);
			}
		});
	},

	Partups(template, query) {
		HTTP.get('/users/me/menu/partups' + mout.queryString.encode(query), function (error, response) {

			if (error || !response.data || !response.data.partups || response.data.partups.length === 0) {
				return;
			}

			const user = Meteor.user();
			const result = response.data;

			// It would be preferable not declaring these in here but the part-ups need to be split.
			// You could store the list as a whole and return a sorted list from the helper. I think the declaration necessary because of the following scenario:
			// The user joins a new part-up after the initial ones are recieved and the collection needs to update.
			// Instead of requesting the whole load only the new one has to be queried and the result pushed to the existing array.
			const upperpartups = [];
			const supporterpartups = [];

			_.forEach(
				_.map(result.partups, partup => Partup.client.embed.partup(partup, result['cfs.images.filerecord'])), partup => {
					if (user.upperOf && user.upperOf.find(id => id === partup._id)) {
						upperpartups.push(partup);
					}
					if (user.supporterOf && user.supporterOf.find(id => id === partup._id)) {
						supporterpartups.push(partup);
					}
				});

			template.results.upperPartups.set(
				_.unionBy(template.results.upperPartups.get(), upperpartups, partup => partup._id)
			);
			template.results.supporterPartups.set(
				_.unionBy(template.results.supporterPartups.get(), supporterpartups, partup => partup._id)
			);
		});
	},
	Networks(template, query) {
		HTTP.get('/users/me/menu/networks' + mout.queryString.encode(query), function (error, response) {

			if (error || !response.data || !response.data.networks) {
				return;
			}

			const result = response.data;

			template.results.networks.set(
				_.unionBy(
					template.results.networks.get(),
					_.map(result.networks, network => Partup.client.embed.network(network, result['cfs.images.filerecord'])),
					network => network._id
				).map(network => _.assign({}, network, { uppers: [Meteor.user()._id] }))
			);

			template.loadingNetworks.set(false);
		});
	}
}
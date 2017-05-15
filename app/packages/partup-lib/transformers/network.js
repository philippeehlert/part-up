/**
 @namespace Network transformer service
 @name partup.transformers.network
 @memberof Partup.transformers
 */
Partup.transformers.network = {
    /**
     * Transform network to start network form
     *
     * @memberof Partup.transformers.network
     * @param {object} network
     */
    'toFormNetwork': function(network) {
        return {
            _id: network._id,
            privacy_type: network.privacy_type,
            description: network.description,
            location_input: Partup.services.location.locationToLocationInput(network.location),
            name: network.name,
            tags_input: Partup.services.tags.tagArrayToInput(network.tags),
            website: network.website,
            background_image: network.background_image,
            image: network.image,
            icon: network.icon,
            sector_id: network.sector_id,
            facebook_url: lodash.get(network, 'facebook_url', ''),
            twitter_url: lodash.get(network, 'twitter_url', ''),
            instagram_url: lodash.get(network, 'instagram_url', ''),
            linkedin_url: lodash.get(network, 'linkedin_url', ''),
        };
    },

    /**
     * Transform network to admin network form
     *
     * @memberof Partup.transformers.network
     * @param {object} network
     */
    'toFormNetworkAdmin': function(network) {
        return {
            admins: Partup.services.tags.tagArrayToInput(network.admins)
        };
    },

    /**
     * Transform network form to network
     *
     * @memberof Partup.transformers.network
     * @param {mixed[]} fields
     */
    'fromFormNetwork': function(fields) {
        var network = {
            name: fields.name,
            description: fields.description,
            website: fields.website,
            tags: Partup.services.tags.tagInputToArray(fields.tags_input),
            language: Partup.server.services.google.detectLanguage(fields.description),
            background_image: fields.background_image,
            image: fields.image,
            icon: fields.icon,
            facebook_url: lodash.get(fields, 'facebook_url', ''),
            twitter_url: lodash.get(fields, 'twitter_url', ''),
            instagram_url: lodash.get(fields, 'instagram_url', ''),
            linkedin_url: lodash.get(fields, 'linkedin_url', ''),
        };


        var newLocation = Partup.services.location.locationInputToLocation(fields.location_input);
        if (newLocation) network.location = newLocation;

        var validSector = Sectors.findOne(fields.sector_id);
        if (validSector) network.sector_id = fields.sector_id;

        return network;
    }
};

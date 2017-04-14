Meteor.startup(function () {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Swarms.find().count()) {

            Swarms.insert({
                "_id": "TFQdDYkCJi4i9CsDq",
                "name": "part-up",
                "slug": "part-up",
                "networks": ['ibn27M3ePaXhmKzWq', 'kRCjWDBkKru3KfsjW'],
                "admin_id": "q63Kii9wwJX3Q6rHS",
                "quotes": [],
                "stats": {
                    "activity_count": 0,
                    "network_count": 0,
                    "partup_count": 0,
                    "supporter_count": 0,
                    "upper_count": 0
                },
                "shared_count": {
                    "facebook": 0,
                    "twitter": 0,
                    "linkedin": 0,
                    "email": 0
                },
                "created_at": new Date('2015-07-21T15:51:56.562Z'),
                "updated_at": new Date('2015-07-21T15:51:56.562Z'),
                "refreshed_at": new Date('2015-07-21T15:51:56.562Z')
            });
        }
    }
})
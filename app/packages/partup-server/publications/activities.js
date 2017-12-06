/**
 * Publish all activities in a partup
 *
 *
 * @param {String} partupId
 * @param {String} accessToken
 */
Meteor.publishComposite('activities.from_partup', function(partupId, accessToken) {
    check(partupId, String);
    if (accessToken) check(accessToken, String);

    this.unblock();

    return {
        find: function() {
            var partup = Partups.guardedFind(this.userId, {_id: partupId}, {limit: 1}, accessToken).fetch().pop();
            if (!partup) return;

            return Activities.findForPartup(partup);
        },
        children: [
            {find: Updates.findForActivity},
            {find: Contributions.findForActivity, children: [
                {
                    find: Meteor.users.findForContribution, children: [
                        {find: Images.findForUser}
                    ]
                },
                {find: Ratings.findForContribution, children: [
                    {find: Meteor.users.findForRating, children: [
                        {find: Images.findForUser}
                    ]},
                ]}
            ]}
        ]
    };
});

/**
 * Publish all activities in a partup
 *
 *
 * @param {String} partupId
 * @param {String} accessToken
 */
Meteor.routeComposite('/activities/me', function(request, parameters) {

    const userId = parameters.query.userId || this.userId;
    const archived = parameters.query && parameters.query.filterByArchived === 'true';
    const user = Meteor.users.findOne(userId, { fields: { _id: 1, upperOf: 1, supporterOf: 1 } });

    const options = {};
    options.limit = parseInt(lodash.get(parameters, 'query.limit')) || 25;
    options.skip = parseInt(lodash.get(parameters, 'query.skip')) || 0;

    const partupsCursor = Partups.findPartupsIdsForUser(user, {fields: { _id: 1, name: 1, image: 1, uppers: 1, slug: 1 }}, userId);
    const partupIds = partupsCursor.map(({_id}) => _id);
    const activityCursor = Activities.findForPartupIds(partupIds, options, { archived });
    const activityIds = activityCursor.map(({_id}) => _id);
    const contributionCursor = Contributions.find({
        activity_id: { $in: activityIds },
    });

    const userIds = contributionCursor.map(({upper_id}) => upper_id);
    const usersCursor = Meteor.users.find(
        { _id: { $in: userIds } },
        { fields: { '_id': 1, 'profile.name': 1, 'profile.image': 1 }},
    );

    const imagesCursor = Images.findForCursors([{
        cursor: usersCursor,
        imageKey: 'profile.image',
    }]);

    return {
        find: () => Meteor.users.find({_id: userId}),
        children: [
            {find: () => partupsCursor},
            {find: () => ({
                fetch: () => activityCursor,
                _cursorDescription: { collectionName: 'activities' },
            })},
            {find: () => contributionCursor},
            {find: () => usersCursor},
            {find: () => imagesCursor},
        ],
    };
});


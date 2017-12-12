/**
 * Children of an update
 */
var updateChildren = [
    {find: Meteor.users.findUserForUpdate, children: [
        {find: Images.findForUser}
    ]},
    {find: Images.findForUpdate},
    {find: Images.findForUpdateComments},
    {find: Files.findForUpdate},
    {find: Activities.findForUpdate},
    {find: Contributions.findForUpdate, children: [
        {find: Activities.findForContribution},
        {find: Ratings.findForContribution, children: [
            {find: Meteor.users.findForRating, children: [
                {find: Images.findForUser}
            ]}
        ]}
    ]}
];

/**
 * Publish all required data for requested update
 *
 * @param {String} updateId
 */
Meteor.publishComposite('updates.one', function(updateId) {
    check(updateId, String);

    this.unblock();

    return {
        find: function() {
            var updateCursor = Updates.find({_id: updateId}, {limit: 1});

            var update = updateCursor.fetch().pop();
            if (!update) return;

            var partup = Partups.guardedFind(this.userId, {_id: update.partup_id}, {limit:1}).fetch().pop();
            if (!partup) return;

            return updateCursor;
        },
        children: updateChildren
    };
});

/**
 * Publish all required data for updates in a part-up
 *
 * @param {String} partupId
 * @param {Object} parameters
 * @param {Number} parameters.limit
 * @param {String} parameters.filter
 * @param {String} accessToken
 */
Meteor.publishComposite('updates.from_partup', function(partupId, parameters, accessToken) {

    check(partupId, String);
    if (accessToken) check(accessToken, String);

    parameters = parameters || {};
    check(parameters, {
        limit: Match.Optional(Number),
        filter: Match.Optional(String)
    });

    this.unblock();
    var self = this;

    return {
        find: function() {
            var partup = Partups.guardedFind(self.userId, {_id: partupId}, {limit: 1}, accessToken).fetch().pop();

            if (!partup) return;

            return Updates.findForPartup(partup, parameters, self.userId);
        },
        children: updateChildren
    };
});

Meteor.publishComposite('updates.comments_by_update_ids', function(updateIds) {
    check(updateIds, [String]);

    this.unblock();

    const selector = {
        _id: {$in: updateIds},
    };

    const options = {
        fields: {
            comments: 1,
            comments_count: 1,
        },
    };

    return {
        find: () => Updates.find(selector, options),
    }
});

Meteor.publishComposite('updates.new_conversations', function({dateFrom}) {
    const user = Meteor.user();

    const partupIds = [
        ...(user.upperOf || []),
        ...(user.supporterOf || []),
    ];

    const options = {
        sort: {updated_at: -1},
        fields: {_id: 1, updated_at: 1},
    };

    const selector = {
        $or: [
            {type: 'partups_message_added'},
            {type: 'partups_activities_comments_added'},
            {comments_count: {$gt: 0}},
        ],
        archived_at: {$exists: false},
        deleted_at: {$exists: false},
        updated_at: {$gte: dateFrom},
        partup_id: {$in: partupIds},
    };

    return {
        find: () => Updates.find(selector, options),
    };
});

Meteor.publishComposite('updates.new_conversations_count', function({dateFrom}) {
    const user = Meteor.user();

    const selector = {
        upper_data: {
            $elemMatch: {
                _id: user._id,
                new_updates: { $exists: true, $not: {$size: 0} },
            },
        },
    };

    const partupsWithUpdatesForUser = Partups.find(selector, { fields: { _id: 1, upper_data: 1 } });

    return {
        find: () => partupsWithUpdatesForUser,
        children: [
            {find: ({upper_data}) => Updates.find({_id: {$in: upper_data.find(({_id}) => _id === user._id).new_updates || []}}, {fields: {_id: 1}})},
        ],
    };
});

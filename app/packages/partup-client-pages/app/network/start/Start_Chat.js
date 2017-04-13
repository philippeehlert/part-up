Template.Start_Chat.onCreated(function() {
    this.MAX_UPPERS = 7;
})

Template.Start_Chat.helpers({
    data: function() {
        const { networkSlug: slug } = this;
        const { admins = [], _id, uppers = [], most_active_uppers = [] } = Networks.findOne({slug});
        return {
            admins: () => {
                return Meteor.users.find({_id: {$in: admins}});
            },
            uppers: () => {
                return Meteor.users.find({_id: {$nin: admins, $in: most_active_uppers}});
            },
            remainingUppers: () => {
                return uppers.length - (most_active_uppers.length + admins.length);
            },
            slug: slug,
        }
    }
});

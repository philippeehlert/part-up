Template.PartupTile_active.helpers({
    avatarPosition: function() {
        return Template.instance().data.partup.hovering.get() ? this.position.hover : this.position.default;
    },
    upperImage: function(upper_id) {
        const upper = Meteor.users.findOne({_id: upper_id});
        return lodash.get(upper, 'profile.imageObject', Images.findOne({_id: lodash.get(upper, 'profile.image')}));
    },
});

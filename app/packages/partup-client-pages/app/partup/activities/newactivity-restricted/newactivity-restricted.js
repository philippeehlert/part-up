function isPendingPartner(partupId) {

        var user = Meteor.user();
        if (!user) return false;
        var partup = Partups.findOne(partupId);
        if (!partup) return false;
        return (partup.pending_partners || []).indexOf(user._id) > -1;
}

Template.app_partup_activities_newactivity_restricted.helpers({

    partup: function() {
        return Partups.findOne(this.partupId);
    },

    isPendingPartner: function() {
        return isPendingPartner(this.partupId);
    }

});


Template.app_partup_activities_newactivity_restricted.events({ 

    'click [data-open-takepart-popup]': function(event, template) {
        if (Meteor.user()) {
            Partup.client.popup.open({
                id: 'take-part'
            });
        } else {
            Intent.go({
                route: 'login'
            }, function(user) {
                if (user) {
                    Partup.client.popup.open({
                        id: 'take-part'
                    });
                }
            });
        }
    }
});
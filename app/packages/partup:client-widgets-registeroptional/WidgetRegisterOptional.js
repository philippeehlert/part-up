Template.WidgetRegisterOptional.onCreated(function(){
    this.uploadingProfilePicture = new ReactiveVar(false);
});
Template.WidgetRegisterOptional.helpers({
    formSchema: Partup.schemas.forms.registerOptional,
    placeholders: Partup.services.placeholders.registerOptional,
    profile: function() {
        var user = Meteor.user()
        return user ? user.profile : {};
    },
    profilePicture: function() {
        var uploadedImageID = Session.get('partials.register-optional.uploaded-image');

        if (uploadedImageID) {
            return Images.findOne({ _id: uploadedImageID });
        }

        var user = Meteor.user();

        if (user && user.profile && user.profile.image) {
            return Images.findOne({ _id: user.profile.image });
        }
    },
    fieldsFromUser: function() {
        var user = Meteor.user();
        if (user) {
            return Partup.transformers.profile.toFormRegisterOptional(user);
        }
        return undefined;
    },
    uploadingProfilePicture: function(){
        return Template.instance().uploadingProfilePicture.get();
    }
});

Template.WidgetRegisterOptional.events({
    'click [data-browse-photos]': function eventClickBrowse(event, template){
        event.preventDefault();

        // in stead fire click event on file input
        var input = $('input[data-profile-picture-input]');
        input.click();
    },
    'change [data-profile-picture-input]': function eventChangeFile(event, template){
        template.uploadingProfilePicture.set(true);
        
        FS.Utility.eachFile(event, function (file) {
            Images.insert(file, function (error, image) {
                // TODO: Handle error in frontend
                // TODO: Somehow show the image in frontend
                template.$('input[name=image]').val(image._id);
                Meteor.subscribe('images.one', image._id);
                Session.set('partials.register-optional.uploaded-image', image._id);

                template.uploadingProfilePicture.set(false);
            });
        });
    }
});

AutoForm.hooks({
    registerOptionalForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            event.preventDefault();
            var self = this;

            Meteor.call('users.update', insertDoc, function(error, res){
                if(error) {
                    console.log('something went wrong', error);
                    return false;
                }
                Router.go('discover');
            });

            //TODO

            self.done();

            //Accounts.createUser({
            //    email: insertDoc.email,
            //    password: insertDoc.password,
            //    profile: {
            //        name: insertDoc.name,
            //        network: insertDoc.network
            //    }
            //}, function(error) {
            //    if (error) {
            //        Partup.ui.notify.iError('generic-error');
            //        return false;
            //    }
            //    Router.go('register-details');
            //})
        }
    }
});

/** ***********************************************************/
/* Widget initial */
/** ***********************************************************/
let placeholders = {
  name: function() {
    return TAPi18n.__('profilesettings-form-name_input-placeholder');
  },
  location_input: function() {
    return TAPi18n.__('profilesettings-form-location_input-placeholder');
  },
  description: function() {
    return TAPi18n.__('profilesettings-form-description-placeholder');
  },
  tags_input: function() {
    return TAPi18n.__('profilesettings-form-tags_input-placeholder');
  },
  facebook_url: function() {
    return TAPi18n.__('profilesettings-form-facebook_url-placeholder');
  },
  twitter_url: function() {
    return TAPi18n.__('profilesettings-form-twitter_url-placeholder');
  },
  instagram_url: function() {
    return TAPi18n.__('profilesettings-form-instagram_url-placeholder');
  },
  linkedin_url: function() {
    return TAPi18n.__('profilesettings-form-linkedin_url-placeholder');
  },
  website: function() {
    return TAPi18n.__('profilesettings-form-website-placeholder');
  },
  phonenumber: function() {
    return TAPi18n.__('profilesettings-form-phonenumber-placeholder');
  },
  skype: function() {
    return TAPi18n.__('profilesettings-form-skype-placeholder');
  },
};

Template.Profilesettings.onCreated(function() {
  let template = this;

  template.locationSelection = new ReactiveVar();

  template.autorun(function() {
    let user = Meteor.user();
    if (!user) return;

    if (
      user.profile &&
      user.profile.location &&
      user.profile.location.place_id
    ) {
      template.locationSelection.set(user.profile.location);
    }
  });

  template.uploadingProfilePicture = new ReactiveVar(false);

  // uploaded picture url
  template.profilePictureUrl = new ReactiveVar('');
  template.currentImageId = new ReactiveVar('');

  // runs after image is updated
  template.autorun(function() {
    // get the current image
    let imageId = Template.instance().currentImageId.get();
    let image = Images.findOne({ _id: imageId });
    if (!image) return;

    // load image from url
    let loadImage = new Image();
    loadImage.onload = function() {
      // this = image
      let src = this.src;

      // set image url
      template.profilePictureUrl.set(src);
      // set loading false
      template.uploadingProfilePicture.set(false);
    };
    // set image url to be loaded
    loadImage.src = Partup.helpers.url.getImageUrl(image);
  });
});

/** ***********************************************************/
/* Widget helpers */
/** ***********************************************************/
Template.Profilesettings.helpers({
  imageInput: function() {
    let template = Template.instance();
    return {
      button: 'data-browse-photos',
      input: 'data-hidden-fileinput',
      onFileChange: function(event) {
        template.uploadingProfilePicture.set(true);
        Partup.client.uploader.eachFile(event, function(file) {
          Partup.client.uploader.uploadImage(file, function(error, image) {
            if (error) {
              Partup.client.notify.error(TAPi18n.__(error.reason));
              template.uploadingProfilePicture.set(false);
              return;
            }

            template.$('input[name=image]').val(image._id);
            template.currentImageId.set(image._id);

            template.uploadingProfilePicture.set(false);
          });
        });
      },
    };
  },
  formSchema: function() {
    return Partup.schemas.forms.profileSettings;
  },
  placeholders: function() {
    return placeholders;
  },
  profile: function() {
    let user = Meteor.user();
    return user ? user.profile : {};
  },
  profilePictureUrl: function() {
    let uploadedImageID = Template.instance().currentImageId.get();

    if (uploadedImageID) {
      var image = Images.findOne({ _id: uploadedImageID });
      return image ? Partup.helpers.url.getImageUrl(image, '360x360') : null;
    }

    let user = Meteor.user();

    if (user && user.profile && user.profile.image) {
      image = Images.findOne({ _id: user.profile.image });
      if (!image) return false;
      return Partup.helpers.url.getImageUrl(image);
    }
  },
  fieldsFromUser: function() {
    let user = Meteor.user();
    if (user) {
      return Partup.transformers.profile.toFormProfileSettings(user);
    }
    return undefined;
  },
  uploadingProfilePicture: function() {
    return Template.instance().uploadingProfilePicture.get();
  },
  firstName: function() {
    let user = Meteor.user();
    return User(user).getFirstname();
  },
  locationLabel: function() {
    return Partup.client.strings.locationToDescription;
  },
  partupFormvalue: function() {
    return function(location) {
      return location.id;
    };
  },
  locationQuery: function() {
    return function(query, sync, async) {
      Meteor.call('google.cities.autocomplete', query, function(
        error,
        locations
      ) {
        lodash.each(locations, function(loc) {
          loc.value = Partup.client.strings.locationToDescription(loc);
        });
        async(locations);
      });
    };
  },
  locationSelectionReactiveVar: function() {
    return Template.instance().locationSelection;
  },
});

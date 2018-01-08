/**
 * Render a form to edit a single network's settings
 *
 * @module client-network-settings
 * @param {Number} networkSlug    the slug of the network whose settings are rendered
 */
Template.NetworkSettings.onCreated(function() {
  let template = this;
  let userId = Meteor.userId();

  template.subscribe('sectors.all');
  template.subscription = template.subscribe(
    'networks.one',
    template.data.networkSlug,
    {
      onReady: function() {
        let network = Networks.findOne({
          slug: template.data.networkSlug,
        });
        if (!network) Router.pageNotFound('network');
        if (network.isClosedForUpper(userId)) {
          Router.pageNotFound('network');
        }
      },
    }
  );
  template.charactersLeft = new ReactiveDict();
  template.submitting = new ReactiveVar();
  template.current = new ReactiveDict();
  template.uploading = new ReactiveDict();

  template.locationSelection = new ReactiveVar();

  template.autorun(function() {
    let network = Networks.findOne({ slug: template.data.networkSlug });
    if (!network) return;

    if (network.location && network.location.place_id) {
      template.locationSelection.set(network.location);
    }

    network = Partup.transformers.network.toFormNetwork(network);

    let formSchema = Partup.schemas.forms.network._schema;
    let valueLength;

    ['description', 'name', 'tags_input', 'location_input', 'website'].forEach(
      function(n) {
        valueLength = network[n] ? network[n].length : 0;
        template.charactersLeft.set(n, formSchema[n].max - valueLength);
      }
    );
  });
});

Template.NetworkSettings.helpers({
  data: function() {
    let template = Template.instance();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    return {
      network: function() {
        return network;
      },
      imageUrl: function() {
        let imageId = template.current.get('image');

        if (!imageId) {
          if (network) imageId = network.image;
        }

        if (imageId) {
          let image = Images.findOne({ _id: imageId });
          if (image) {
            return Partup.helpers.url.getImageUrl(image, '360x360');
          }
        }

        return '/images/smile.png';
      },

      iconUrl: function() {
        let iconId = template.current.get('icon');

        if (!iconId) {
          if (network) iconId = network.icon;
        }

        if (iconId) {
          let icon = Images.findOne({ _id: iconId });
          if (icon) {
            return Partup.helpers.url.getImageUrl(icon, '360x360');
          }
        }

        return '/images/smile.png';
      },
      backgroundImageUrl: function() {
        let backgroundImageId = template.current.get('background_image');

        if (!backgroundImageId) {
          if (network) backgroundImageId = network.background_image;
        }

        if (backgroundImageId) {
          let backgroundImage = Images.findOne({
            _id: backgroundImageId,
          });
          if (backgroundImage) {
            return Partup.helpers.url.getImageUrl(backgroundImage, '360x360');
          }
        }

        return '/images/tribestart.jpg';
      },
      sectors: function() {
        return Sectors.find();
      },
      isNetworkSector: function(sector_id) {
        return network && network.sector_id
          ? network.sector_id === sector_id
          : false;
      },
    };
  },
  form: function() {
    let template = Template.instance();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    return {
      imageInput: function() {
        return {
          button: 'data-image-browse',
          input: 'data-image-input',
          onFileChange: function(event) {
            Partup.client.uploader.eachFile(event, function(file) {
              template.uploading.set('image', true);

              Partup.client.uploader.uploadImage(file, function(error, image) {
                template.uploading.set('image', false);

                if (error) {
                  Partup.client.notify.error(TAPi18n.__(error.reason));
                  return;
                }

                template.find('[name=image]').value = image._id;
                template.current.set('image', image._id);
              });
            });
          },
        };
      },
      iconInput: function() {
        return {
          button: 'data-icon-browse',
          input: 'data-icon-input',
          onFileChange: function(event) {
            Partup.client.uploader.eachFile(event, function(file) {
              template.uploading.set('icon', true);

              Partup.client.uploader.uploadImage(file, function(error, image) {
                template.uploading.set('icon', false);

                if (error) {
                  Partup.client.notify.error(TAPi18n.__(error.reason));
                  return;
                }

                template.find('[name=icon]').value = image._id;
                template.current.set('icon', image._id);
              });
            });
          },
        };
      },
      backgroundImageInput: function() {
        return {
          button: 'data-backgroundimage-browse',
          input: 'data-backgroundimage-input',
          onFileChange: function(event) {
            Partup.client.uploader.eachFile(event, function(file) {
              template.uploading.set('background_image', true);

              Partup.client.uploader.uploadImage(file, function(
                error,
                backgroundImage
              ) {
                template.uploading.set('background_image', false);

                if (error) {
                  Partup.client.notify.error(TAPi18n.__(error.reason));
                  return;
                }

                template.find('[name=background_image]').value =
                  backgroundImage._id;
                template.current.set('background_image', backgroundImage._id);
              });
            });
          },
        };
      },
      schema: Partup.schemas.forms.network,
      fieldsForNetwork: function() {
        if (!network) return;

        return Partup.transformers.network.toFormNetwork(network);
      },
      // Location autocomplete helpers
      locationLabel: function() {
        return Partup.client.strings.locationToDescription;
      },
      locationFormvalue: function() {
        return function(location) {
          return location.id;
        };
      },
      locationSelectionReactiveVar: function() {
        return template.locationSelection;
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
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      imageUploading: function() {
        return !!template.uploading.get('image');
      },
      iconUploading: function() {
        return !!template.uploading.get('icon');
      },
      backgroundImageUploading: function() {
        return !!template.uploading.get('background_image');
      },
      descriptionCharactersLeft: function() {
        return template.charactersLeft.get('description');
      },
      nameCharactersLeft: function() {
        return template.charactersLeft.get('name');
      },
      tags_inputCharactersLeft: function() {
        return template.charactersLeft.get('tags_input');
      },
      location_inputCharactersLeft: function() {
        return template.charactersLeft.get('location_input');
      },
      websiteCharactersLeft: function() {
        return template.charactersLeft.get('website');
      },
      submitting: function() {
        return template.submitting.get();
      },
    };
  },
  placeholders: function() {
    return {
      name: function() {
        return TAPi18n.__('network-settings-form-name-placeholder');
      },
      description: function() {
        return TAPi18n.__('network-settings-form-description-placeholder');
      },
      tags_input: function() {
        return TAPi18n.__('network-settings-form-tags_input-placeholder');
      },
      location_input: function() {
        return TAPi18n.__('network-settings-form-location_input-placeholder');
      },
      website: function() {
        return TAPi18n.__('network-settings-form-website-placeholder');
      },
      facebook_url: function() {
        return TAPi18n.__('network-settings-form-facebook_url-placeholder');
      },
      twitter_url: function() {
        return TAPi18n.__('network-settings-form-twitter_url-placeholder');
      },
      instagram_url: function() {
        return TAPi18n.__('network-settings-form-instagram_url-placeholder');
      },
      linkedin_url: function() {
        return TAPi18n.__('network-settings-form-linkedin_url-placeholder');
      },
    };
  },
});

Template.NetworkSettings.events({
  'input [maxlength]': function(e, template) {
    template.charactersLeft.set(this.name, this.max - e.target.value.length);
  },
  'change [data-select-sector]': function(event, template) {
    $('[data-sector-input]').val($(event.currentTarget).val());
  },
});

AutoForm.addHooks('networkEditForm', {
  onSubmit: function(doc) {
    let self = this;
    let template = self.template.parent();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    template.submitting.set(true);

    Meteor.call('networks.update', network._id, doc, function(err) {
      template.submitting.set(false);

      if (err && err.message) {
        Partup.client.notify.error(err.reason);
        return;
      }

      Partup.client.notify.success(TAPi18n.__('network-settings-form-saved'));
      self.done();
    });

    return false;
  },
});

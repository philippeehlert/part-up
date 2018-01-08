Template.modal_swarm_settings_details.onCreated(function() {
  let tpl = this;
  let userId = Meteor.userId();

  tpl.charactersLeft = new ReactiveDict();
  tpl.submitting = new ReactiveVar();
  tpl.current = new ReactiveDict();
  tpl.uploading = new ReactiveDict();

  tpl.locationSelection = new ReactiveVar();

  tpl.autorun(function() {
    let swarm = Swarms.findOne({ slug: tpl.data.slug });
    if (!swarm) return;

    swarm = Partup.transformers.swarm.toFormSwarm(swarm);

    let formSchema = Partup.schemas.entities.swarm._schema;
    let valueLength;

    ['description', 'title', 'introduction'].forEach(function(n) {
      valueLength = swarm[n] ? swarm[n].length : 0;
      tpl.charactersLeft.set(n, formSchema[n].max - valueLength);
    });
  });
});

Template.modal_swarm_settings_details.helpers({
  data: function() {
    let template = Template.instance();
    let swarm = Swarms.findOne({ slug: template.data.slug });
    if (!swarm) return false;
    return {
      swarm: function() {
        return swarm;
      },
      imageUrl: function() {
        let imageId = template.current.get('image');

        if (!imageId) {
          if (swarm) imageId = swarm.image;
        }

        if (imageId) {
          let image = Images.findOne({ _id: imageId });
          if (image) {
            return Partup.helpers.url.getImageUrl(image, '360x360');
          }
        }

        return '/images/smile.png';
      },
    };
  },
  form: function() {
    let swarm = Swarms.findOne({ slug: this.slug });
    let template = Template.instance();
    return {
      schema: Partup.schemas.forms.swarmUpdate,
      fieldsForSwarm: function() {
        if (!swarm) return;
        return Partup.transformers.swarm.toFormSwarm(swarm);
      },
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
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      submitting: function() {
        return template.submitting.get();
      },
      descriptionCharactersLeft: function() {
        return template.charactersLeft.get('description');
      },
      titleCharactersLeft: function() {
        return template.charactersLeft.get('title');
      },
      introductionCharactersLeft: function() {
        return template.charactersLeft.get('introduction');
      },
      imageUploading: function() {
        return !!template.uploading.get('image');
      },
    };
  },
  translations: function() {
    return {
      title: function() {
        return TAPi18n.__('modal-swarm-details-form-title-placeholder');
      },
      description: function() {
        return TAPi18n.__('modal-swarm-details-form-shortintro-placeholder');
      },
      introduction: function() {
        return TAPi18n.__('modal-swarm-details-form-organization-placeholder');
      },
    };
  },
});

Template.modal_swarm_settings_details.events({
  'input [maxlength]': function(e, template) {
    template.charactersLeft.set(this.name, this.max - e.target.value.length);
  },
});

AutoForm.addHooks('swarmEditForm', {
  onSubmit: function(doc) {
    let self = this;
    self.event.preventDefault();
    let template = self.template.parent();
    let swarm = Swarms.findOne({ slug: template.data.slug });

    template.submitting.set(true);

    Meteor.call('swarms.update', swarm._id, doc, function(err) {
      template.submitting.set(false);

      if (err && err.message) {
        Partup.client.notify.error(TAPi18n.__(err.reason));
        return;
      }

      Partup.client.notify.success(
        TAPi18n.__('modal-swarm-details-form-saved')
      );
      self.done();
    });

    return false;
  },
});

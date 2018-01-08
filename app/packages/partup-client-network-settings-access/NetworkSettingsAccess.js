/**
 * Render a form to edit a single network's access settings
 *
 * @module client-network-settings-access
 * @param {Number} networkSlug    the slug of the network whose settings are rendered
 */
Template.NetworkSettingsAccess.onCreated(function() {
  let template = this;
  let userId = Meteor.userId();
  let network = Networks.findOne({ slug: template.data.networkSlug });
  template.create_partup_restricted = new ReactiveVar(false);
  template.colleagues_default_enabled = new ReactiveVar(false);
  template.colleagues_custom_a_enabled = new ReactiveVar(false);
  template.colleagues_custom_b_enabled = new ReactiveVar(false);

  template.subscribe('networks.one.partups', {
    slug: template.data.networkSlug,
  });

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

        template.create_partup_restricted.set(network.create_partup_restricted);

        template.colleagues_default_enabled.set(
          network.colleaguesRoleEnabled()
        );
        template.colleagues_custom_a_enabled.set(network.customARoleEnabled());
        template.colleagues_custom_b_enabled.set(network.customBRoleEnabled());
      },
    }
  );

  template.charactersLeft = new ReactiveDict();
  template.submitting = new ReactiveVar();

  template.autorun(function() {
    let network = Networks.findOne({ slug: template.data.networkSlug });
    if (!network) return;

    network = Partup.transformers.networkAccess.toFormNetworkAccess(network);

    let formSchema = Partup.schemas.forms.networkAccess._schema;
    let valueLength;

    [
      'label_admins',
      'label_colleagues',
      'label_colleagues_custom_a',
      'label_colleagues_custom_b',
    ].forEach(function(n) {
      valueLength = network[n] ? network[n].length : 0;
      template.charactersLeft.set(n, formSchema[n].max - valueLength);
    });
  });
});

Template.NetworkSettingsAccess.helpers({
  data: function() {
    let template = Template.instance();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    if (!network) return;
    let partups = Partups.find({ network_id: network._id }).fetch();
    if (!partups) return;
    return {
      hasActivePartupsCollegues: function() {
        let networkHasColleagues = network.hasColleagues();
        let networkHasPartupsWithColleguesRoleEnabled = network.hasPartupsWithColleaguesRoleEnabled(
          partups
        );
        return (
          networkHasPartupsWithColleguesRoleEnabled || networkHasColleagues
        );
      },
      hasActivePartupsCustomA: function() {
        let networkHasColleaguesCustomA = network.hasColleaguesCustomA();
        let networkHasPartupsWithColleaguesCustomARoleEnabled = network.hasPartupsWithColleaguesCustomARoleEnabled(
          partups
        );
        return (
          networkHasPartupsWithColleaguesCustomARoleEnabled ||
          networkHasColleaguesCustomA
        );
      },
      hasActivePartupsCustomB: function() {
        let networkHasPartupsWithColleaguesCustomBRoleEnabled = network.hasPartupsWithColleaguesCustomBRoleEnabled(
          partups
        );
        let networkHasColleaguesCustomB = network.hasColleaguesCustomB();
        return (
          networkHasPartupsWithColleaguesCustomBRoleEnabled ||
          networkHasColleaguesCustomB
        );
      },
      create_partup_restricted: function() {
        return template.create_partup_restricted.get();
      },
      colleagues_default_enabled: function() {
        return template.colleagues_default_enabled.get();
      },
      colleagues_custom_a_enabled: function() {
        return template.colleagues_custom_a_enabled.get();
      },
      colleagues_custom_b_enabled: function() {
        return template.colleagues_custom_b_enabled.get();
      },
    };
  },
  form: function() {
    let template = Template.instance();
    return {
      schema: Partup.schemas.forms.networkAccess,
      fieldsForNetworkAccess: function() {
        let network = Networks.findOne({
          slug: template.data.networkSlug,
        });
        if (!network) return;

        return Partup.transformers.networkAccess.toFormNetworkAccess(network);
      },
    };
  },
  placeholders: function() {
    return {
      admins: function() {
        return TAPi18n.__('network-settings-uppers-label-admin');
      },
      colleagues: function() {
        return TAPi18n.__('network-settings-uppers-label-colleague');
      },
      colleagues_custom_a: function() {
        return TAPi18n.__('network-settings-uppers-label-colleague-custom-a');
      },
      colleagues_custom_b: function() {
        return TAPi18n.__('network-settings-uppers-label-colleague-custom-b');
      },
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      labelAdminsCharactersLeft: function() {
        return template.charactersLeft.get('label_admins');
      },
      labelColleaguesCharactersLeft: function() {
        return template.charactersLeft.get('label_colleagues');
      },
      labelColleaguesCustomACharactersLeft: function() {
        return template.charactersLeft.get('label_colleagues_custom_a');
      },
      labelColleaguesCustomBCharactersLeft: function() {
        return template.charactersLeft.get('label_colleagues_custom_b');
      },
      submitting: function() {
        return template.submitting.get();
      },
    };
  },
});

Template.NetworkSettingsAccess.events({
  'input [maxlength]': function(e, template) {
    template.charactersLeft.set(this.name, this.max - e.target.value.length);
  },
  'click [data-switch]': function(event, template) {
    event.preventDefault();
    let field = $(event.currentTarget).attr('data-switch');
    if (field) template[field].set(!template[field].curValue);

    _.defer(function() {
      $('#NetworkSettingsAccessForm').submit();
    });
  },
});

AutoForm.addHooks('NetworkSettingsAccessForm', {
  onSubmit: function(doc) {
    let self = this;
    let template = self.template.parent();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    let partups = Partups.find({ network_id: network._id }).fetch();
    template.submitting.set(true);
    doc.create_partup_restricted = doc.create_partup_restricted || false;
    doc.colleagues_default_enabled =
      network.hasPartupsWithColleaguesRoleEnabled(partups) ||
      network.hasColleagues()
        ? true
        : doc.colleagues_default_enabled || false;
    doc.colleagues_custom_a_enabled =
      network.hasPartupsWithColleaguesCustomARoleEnabled(partups) ||
      network.hasColleaguesCustomA()
        ? true
        : doc.colleagues_custom_a_enabled || false;
    doc.colleagues_custom_b_enabled =
      network.hasPartupsWithColleaguesCustomBRoleEnabled(partups) ||
      network.hasColleaguesCustomB()
        ? true
        : doc.colleagues_custom_b_enabled || false;
    Meteor.call('networks.updateAccess', network._id, doc, function(err) {
      template.submitting.set(false);

      if (err && err.message) {
        Partup.client.notify.error(err.reason);
        return;
      }

      Partup.client.notify.success(
        TAPi18n.__('network-settings-access-form-saved')
      );
      self.done();
    });

    return false;
  },
});

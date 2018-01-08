Template.AdminCreateTribe.onCreated(function() {
  let template = this;
  template.subscribe('networks.admin_all');
  template.currentNetwork = new ReactiveVar('');
  template.searchQuery = new ReactiveVar(undefined, function(a, b) {
    if (a === b) return;
    template.limit.set(50);
  });
  template.limit = new ReactiveVar(50);
});

let placeholders = {
  name: function() {
    return TAPi18n.__('pages-modal-create-details-form-name-placeholder');
  },
};

let privacyTypeOptions = [
  {
    label: 'Public',
    value: 1,
  },
  {
    label: 'Invite',
    value: 2,
  },
  {
    label: 'Closed',
    value: 3,
  },
];

Template.AdminCreateTribe.helpers({
  privacyTypeOptions: function() {
    return privacyTypeOptions;
  },
  networks: function() {
    let template = Template.instance();
    let opts = {};
    let query = template.searchQuery.get();
    let limit = template.limit.get();
    if (query) {
      opts = { name: { $regex: query, $options: 'i' } };
    }
    return Networks.find(opts, { limit: limit });
  },
  privacyType: function(type) {
    let pType = _.findWhere(privacyTypeOptions, { value: type });
    if (!pType) return false;
    return pType.label ? pType.label : false;
  },
  upperCount: function(network) {
    return network.uppers ? network.uppers.length : 0;
  },
  currentNetwork: function() {
    return Template.instance().currentNetwork.get();
  },
  networkAdmins: function() {
    return Meteor.users.find({ _id: { $in: this.admins || [] } });
  },
});

/** ***********************************************************/
/* Widget events */
/** ***********************************************************/
Template.AdminCreateTribe.events({
  'click [data-toggle]': function(event) {
    event.preventDefault();
    $(event.currentTarget)
      .next('[data-toggle-target]')
      .toggleClass('pu-state-active');
    $('[data-toggle-target]')
      .not($(event.currentTarget).next('[data-toggle-target]')[0])
      .removeClass('pu-state-active');
  },
  'click [data-expand]': function(event) {
    $(event.currentTarget).addClass('pu-state-expanded');
  },
  'click [data-closepage]': function(event, template) {
    event.preventDefault();
    Intent.return('create-network', {
      fallback_route: {
        name: 'discover',
      },
    });
  },
  'submit .tribesearch': function(event, template) {
    event.preventDefault();

    let query = template.find('[data-tribesearchfield]').value;
    template.searchQuery.set(query);
  },
  'click [data-showmore]': function(event, template) {
    template.limit.set(template.limit.curValue + 50);
  },
  'click [data-network-edit]': function(event, template) {
    let networkSlug = $(event.currentTarget).data('network-edit');
    template.currentNetwork.set(networkSlug);
    Partup.client.popup.open({
      id: 'popup.admin-edit-tribe',
    });
  },
  'click [data-network-remove]': function(event, template) {
    let networkId = $(event.currentTarget).data('network-remove');
    let network = Networks.findOne(networkId);
    Partup.client.prompt.confirm({
      title: 'Are you sure you want to delete this tribe?',
      message:
        'There are still ' +
        network.stats.partup_count +
        ' active part-ups and ' +
        network.stats.upper_count +
        ' active uppers in this tribe. This action cannot be undone',
      onConfirm: function() {
        Meteor.call('networks.remove', networkId, function(error) {
          if (error) {
            Partup.client.notify.error(
              TAPi18n.__('pages-modal-admin-createtribe-error-' + error.reason)
            );
            return;
          }
          Partup.client.notify.success('Tribe removed correctly');
        });
      },
    });
  },
  'click [data-network-archive]': function(event, template) {
    let networkSlug = $(event.currentTarget).data('network-archive');
    let network = Networks.findOne({ slug: networkSlug });
    Partup.client.prompt.confirm({
      title: 'Are you sure you want to archive this tribe?',
      message:
        'There are still ' +
        network.stats.partup_count +
        ' active part-ups and ' +
        network.stats.upper_count +
        ' active uppers in this tribe.',
      onConfirm: function() {
        Meteor.call('networks.archive', networkSlug, function(error) {
          if (error) {
            Partup.client.notify.error(
              TAPi18n.__('pages-modal-admin-createtribe-error-' + error.reason)
            );
            return;
          }
          Partup.client.notify.success('Tribe archived correctly');
        });
      },
    });
  },
  'click [data-network-unarchive]': function(event, template) {
    let networkSlug = $(event.currentTarget).data('network-unarchive');
    let network = Networks.findOne({ slug: networkSlug });
    Partup.client.prompt.confirm({
      title: 'Are you sure you want to archive this tribe?',
      message:
        'There are still ' +
        network.stats.partup_count +
        ' active part-ups and ' +
        network.stats.upper_count +
        ' active uppers in this tribe.',
      onConfirm: function() {
        Meteor.call('networks.unarchive', networkSlug, function(error) {
          if (error) {
            Partup.client.notify.error(
              TAPi18n.__('pages-modal-admin-createtribe-error-' + error.reason)
            );
            return;
          }
          Partup.client.notify.success('Tribe unarchived correctly');
        });
      },
    });
  },
});

/** ***********************************************************/
/* Widget form hooks */
/** ***********************************************************/
AutoForm.hooks({
  createNetworkForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;

      Meteor.call('networks.insert', insertDoc, function(error, networkId) {
        if (error) {
          Partup.client.notify.error(
            TAPi18n.__('pages-modal-admin-createtribe-error-' + error.reason)
          );
          return;
        }
        Partup.client.notify.success('Tribe inserted correctly');
      });

      return false;
    },
  },
});

/**
 */
Template.EditPartup.onCreated(function() {
  let template = this;
  template.submitting = new ReactiveVar(false);
  template.networkSelection = new ReactiveVar();
  template.partup_id = template.data.partup._id;
  template.subscribe('partups.one', template.partup_id);

  template.autorun(function() {
    let partup = Partups.findOne(template.partup_id);
    if (!partup || !partup.network_id) return;
    template.subscribe('networks.admin_one', partup.network_id, {
      onReady: function() {
        let network = Networks.findOne(partup.network_id);
        template.networkSelection.set(network);
      },
    });
  });
});

Template.EditPartup.helpers({
  formSchema: Partup.schemas.forms.editPartup,
  submitting: function() {
    return Template.instance().submitting.get();
  },
  partup: function() {
    return Template.instance().data.partup;
  },
  networkFieldPlaceholder: function() {
    return TAPi18n.__(
      'pages-modal-admin-featured-networks-form-network-placeholder'
    );
  },
  networkLabel: function() {
    return function(network) {
      return network.name;
    };
  },
  networkSelectionReactiveVar: function() {
    return Template.instance().networkSelection;
  },
  networkQuery: function() {
    return function(query, sync, async) {
      Meteor.call('networks.autocomplete', query, function(error, networks) {
        lodash.each(networks, function(p) {
          p.value = p.name; // what to show in the autocomplete list
        });
        async(networks);
      });
    };
  },
  networkFormvalue: function() {
    return function(network) {
      return network._id;
    };
  },
});

AutoForm.hooks({
  adminEditPartupTribeForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;
      let template = self.template.parent();

      template.submitting.set(true);

      Meteor.call(
        'partups.change_network',
        template.partup_id,
        insertDoc.network_id,
        function(err, res) {
          template.submitting.set(false);
          if (err) {
            return Partup.client.notify.error(
              TAPi18n.__('base-errors-' + err.reason)
            );
          }
          Partup.client.notify.success('Tribe changed correctly');
          Partup.client.popup.close();
        }
      );

      return false;
    },
  },
});

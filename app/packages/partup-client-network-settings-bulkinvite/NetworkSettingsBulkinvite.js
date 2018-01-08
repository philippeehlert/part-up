/**
 * Invite multiple uppers to a network at once, using a CSV file
 *
 * @module client-network-settings-bulkinvite
 * @param {Number} networkSlug    the slug of the network
 */

Template.NetworkSettingsBulkinvite.onCreated(function() {
  let template = this;
  let userId = Meteor.userId();

  template.subscribe('networks.one', template.data.networkSlug, {
    onReady: function() {
      let network = Networks.findOne({ slug: template.data.networkSlug });
      if (!network) Router.pageNotFound('network');
      if (network.isClosedForUpper(userId)) {
        Router.pageNotFound('network');
      }
    },
  });

  template.submitting = new ReactiveVar(false);
  template.csv_invalid = new ReactiveVar(false);
  template.csv_too_many_addresses = new ReactiveVar(false);
  template.parsing = new ReactiveVar(false);
  template.invitees = new ReactiveVar([]);
});

Template.NetworkSettingsBulkinvite.helpers({
  data: function() {
    let template = Template.instance();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    return {
      network: function() {
        return network;
      },
      currentCsvInvitees: function() {
        return template.invitees.get();
      },
    };
  },
  form: function() {
    let template = Template.instance();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    return {
      schema: function() {
        return Partup.schemas.forms.networkBulkinvite;
      },
      defaultDoc: function() {
        if (!network) return false;
        return {
          message: TAPi18n.__('network-settings-bulkinvite-message_prefill', {
            networkName: network.name,
            networkDescription: network.description,
            inviterName: Meteor.user().profile.name,
          }),
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
      parsing: function() {
        return template.parsing.get();
      },
      csvInvalid: function() {
        return template.csv_invalid.get();
      },
      csvTooManyAddresses: function() {
        return template.csv_too_many_addresses.get();
      },
    };
  },
});

Template.NetworkSettingsBulkinvite.events({
  'change [data-csv-file]': function(event, template) {
    event.preventDefault();
    if (!event.currentTarget.value) return;

    template.parsing.set(true);
    template.csv_invalid.set(false);
    template.csv_too_many_addresses.set(false);

    let file = event.currentTarget.files[0];
    let token = Accounts._storedLoginToken();
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      let data = JSON.parse(xhr.responseText);

      if (data.error) {
        Partup.client.notify.error(TAPi18n.__(data.error.reason));
        console.error(
          'Result from uploading & parsing CSV:',
          TAPi18n.__(data.error.reason)
        );
        template.csv_invalid.set(true);

        if (error.reason == 'too_many_email_addresses') {
          template.csv_too_many_addresses.set(true);
        }

        return;
      }

      template.invitees.set(data.result);
      template.parsing.set(false);

      let jqInput = $(event.currentTarget.value);
      jqInput.replaceWith(jqInput.val('').clone(true));
    });
    xhr.open('POST', Meteor.absoluteUrl() + 'csv/parse?token=' + token);

    let formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  },
  'click [data-browse-file]': function(evemt, template) {
    event.preventDefault();
    $('[data-csv-file]').click();
  },
});

AutoForm.hooks({
  bulkInviteToNetworkForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      let self = this;
      self.event.preventDefault();
      let template = self.template.parent();

      let parent = Template.instance().parent();
      parent.submitting.set(true);

      let invitees = parent.invitees.get();

      let network = Networks.findOne({ slug: template.data.networkSlug });

      Meteor.call(
        'networks.invite_by_email_bulk',
        network._id,
        insertDoc,
        invitees,
        function(error, result) {
          parent.submitting.set(false);
          if (error) {
            return Partup.client.notify.error(
              TAPi18n.__('base-errors-' + error.reason)
            );
          }
          Partup.client.notify.success(
            TAPi18n.__('network-settings-bulkinvite-success')
          );
        }
      );

      return false;
    },
  },
});

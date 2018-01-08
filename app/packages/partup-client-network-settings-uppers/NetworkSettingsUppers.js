// jscs:disable
/**
 * Render a widget to view/edit a single network's uppers
 *
 * @module client-network-settings-uppers
 * @param {Number} networkSlug    the slug of the network whose uppers are rendered
 */
// jscs:enable
Template.NetworkSettingsUppers.onCreated(function() {
  let template = this;
  let userId = Meteor.userId();
  let endReached = false;

  template.searchQuery = new ReactiveVar(undefined, function() {
    endReached = false;
    template.limit.set(10);
  });
  template.reactiveLabel = new ReactiveVar('No uppers');
  template.loadingInfiniteScroll = new ReactiveVar(true);

  template.limit = new ReactiveVar(10, function(a, b) {
    if (endReached) return;
    template.loadingInfiniteScroll.set(true);
    template.upperSub = template.subscribe(
      'networks.one.uppers',
      { slug: template.data.networkSlug },
      { limit: b },
      {
        onReady: function() {
          template.loadingInfiniteScroll.set(false);

          let network = Networks.findOne({
            slug: template.data.networkSlug,
          });

          if (network) {
            let searchOptions = {
              _id: { $in: network.uppers || [] },
            };
            let searchQuery = template.searchQuery.get();
            if (searchQuery) {
              searchOptions['profile.name'] = {
                $regex: searchQuery,
                $options: 'i',
              };
            }
            let total = (network.uppers || []).length;

            if (total <= b) endReached = true;
          }
        },
      }
    );
  });

  template.subscription = template.subscribe(
    'networks.one',
    template.data.networkSlug,
    {
      onReady: function() {
        let network = Networks.findOne({
          slug: template.data.networkSlug,
        });
        template.networkId = network._id;
        if (!network) Router.pageNotFound('network');
        if (network.isClosedForUpper(userId)) {
          Router.pageNotFound('network');
        }
      },
    }
  );

  template.upperSub = template.subscribe(
    'networks.one.uppers',
    { slug: template.data.networkSlug },
    { limit: 10 },
    {
      onReady: function() {
        template.loadingInfiniteScroll.set(false);
      },
    }
  );

  template.callMethod = function(
    method,
    networkSlug,
    userId,
    userName,
    successKey,
    privacyType
  ) {
    let network = Networks.findOne({ slug: template.data.networkSlug });

    Meteor.call(method, networkSlug, userId, function(err, res) {
      if (err) {
        Partup.client.notify.error(err.reason);
        return;
      }
      // if there is a custom privacyType label
      if (
        network.privacy_type_labels &&
        network.privacy_type_labels[privacyType]
      ) {
        successKey = successKey.match(/^[a-z]+(-[a-z]+)*-removed$/)
          ? 'network-settings-uppers-custom-removed'
          : 'network-settings-uppers-custom-added';
        Partup.client.notify.success(
          TAPi18n.__(successKey, {
            name: userName,
            type: network.privacy_type_labels[privacyType],
          })
        );
        // else show the default message
      } else {
        Partup.client.notify.success(
          TAPi18n.__(successKey, {
            name: userName,
          })
        );
      }
    });
  };
});

Template.NetworkSettingsUppers.onRendered(function() {
  let template = this;
  Partup.client.scroll.infinite(
    {
      template: template,
      element: $('body')[0],
      offset: 200,
    },
    function() {
      template.limit.set(template.limit.curValue + 10);
    }
  );
});

Template.NetworkSettingsUppers.helpers({
  data: function() {
    let template = Template.instance();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    if (!network) return;
    let searchOptions = {
      _id: { $in: network.uppers || [] },
    };
    let searchQuery = template.searchQuery.get();
    if (searchQuery) {
      searchOptions['profile.name'] = {
        $regex: searchQuery,
        $options: 'i',
      };
    }
    let uppers = Meteor.users.find(searchOptions).fetch();
    template.reactiveLabel.set((network.uppers || []).length + ' uppers');
    let self = this;
    return {
      network: function() {
        return network;
      },
      uppers: function() {
        _.each(uppers, function(upper) {
          upper.email = User(upper).getEmail() || false;
          if (network.isNetworkAdmin(upper._id)) {
            upper.isNetworkAdmin = network.isNetworkAdmin(upper._id);
            upper.privacyType =
              network.privacy_type_labels && network.privacy_type_labels[6]
                ? network.privacy_type_labels[6]
                : TAPi18n.__('network-settings-uppers-label-admin');
          }
          if (network.isNetworkColleague(upper._id)) {
            upper.isNetworkColleague = network.isNetworkColleague(upper._id);
            upper.privacyType =
              network.privacy_type_labels && network.privacy_type_labels[7]
                ? network.privacy_type_labels[7]
                : TAPi18n.__('network-settings-uppers-label-colleague');
          }
          if (network.isNetworkColleagueCustomA(upper._id)) {
            upper.isNetworkColleagueCustomA = network.isNetworkColleagueCustomA(
              upper._id
            );
            upper.privacyType =
              network.privacy_type_labels && network.privacy_type_labels[8]
                ? network.privacy_type_labels[8]
                : TAPi18n.__(
                  'network-settings-uppers-label-colleague-custom-a'
                );
          }
          if (network.isNetworkColleagueCustomB(upper._id)) {
            upper.isNetworkColleagueCustomB = network.isNetworkColleagueCustomB(
              upper._id
            );
            upper.privacyType =
              network.privacy_type_labels && network.privacy_type_labels[9]
                ? network.privacy_type_labels[9]
                : TAPi18n.__(
                  'network-settings-uppers-label-colleague-custom-b'
                );
          }
          upper.isOnlyMember =
            !network.isNetworkAdmin(upper._id) &&
            !network.isNetworkColleague(upper._id) &&
            !network.isNetworkColleagueCustomA(upper._id) &&
            !network.isNetworkColleagueCustomB(upper._id);
        });
        return uppers;
      },
      searchQuery: function() {
        return template.searchQuery.get();
      },
      privacyTypeLabelAdd: function(privacyType) {
        switch (privacyType) {
          case 'network_admins':
            return network.privacy_type_labels && network.privacy_type_labels[6]
              ? TAPi18n.__('network-settings-uppers-button-add-custom', {
                name: network.privacy_type_labels[6],
              })
              : TAPi18n.__('network-settings-uppers-button-add-admin');
          case 'network_colleagues':
            return network.privacy_type_labels && network.privacy_type_labels[7]
              ? TAPi18n.__('network-settings-uppers-button-add-custom', {
                name: network.privacy_type_labels[7],
              })
              : TAPi18n.__('network-settings-uppers-button-add-colleague');
          case 'network_colleagues_custom_a':
            return network.privacy_type_labels && network.privacy_type_labels[8]
              ? TAPi18n.__('network-settings-uppers-button-add-custom', {
                name: network.privacy_type_labels[8],
              })
              : TAPi18n.__(
                'network-settings-uppers-button-add-colleague-custom-a'
              );
          case 'network_colleagues_custom_b':
            return network.privacy_type_labels && network.privacy_type_labels[9]
              ? TAPi18n.__('network-settings-uppers-button-add-custom', {
                name: network.privacy_type_labels[9],
              })
              : TAPi18n.__(
                'network-settings-uppers-button-add-colleague-custom-b'
              );
        }
        return false;
      },
      privacyTypeLabelRemove: function(privacyType) {
        switch (privacyType) {
          case 'network_admins':
            return network.privacy_type_labels && network.privacy_type_labels[6]
              ? TAPi18n.__('network-settings-uppers-button-remove-custom', {
                name: network.privacy_type_labels[6],
              })
              : TAPi18n.__('network-settings-uppers-button-remove-admin');
          case 'network_colleagues':
            return network.privacy_type_labels && network.privacy_type_labels[7]
              ? TAPi18n.__('network-settings-uppers-button-remove-custom', {
                name: network.privacy_type_labels[7],
              })
              : TAPi18n.__('network-settings-uppers-button-remove-colleague');
          case 'network_colleagues_custom_a':
            return network.privacy_type_labels && network.privacy_type_labels[8]
              ? TAPi18n.__('network-settings-uppers-button-remove-custom', {
                name: network.privacy_type_labels[8],
              })
              : TAPi18n.__(
                'network-settings-uppers-button-remove-colleague-custom-a'
              );
          case 'network_colleagues_custom_b':
            return network.privacy_type_labels && network.privacy_type_labels[9]
              ? TAPi18n.__('network-settings-uppers-button-remove-custom', {
                name: network.privacy_type_labels[9],
              })
              : TAPi18n.__(
                'network-settings-uppers-button-remove-colleague-custom-b'
              );
        }
        return false;
      },
    };
  },
  form: function() {
    let template = Template.instance();
    return {
      searchInput: function() {
        return {
          reactiveLabel: template.reactiveLabel,
          reactiveSearchQuery: template.searchQuery,
        };
      },
    };
  },
  getToken: function() {
    return Accounts._storedLoginToken();
  },
  loadingInfiniteScroll: function() {
    return Template.instance().loadingInfiniteScroll.get();
  },
});

Template.NetworkSettingsUppers.events({
  'click [data-toggle]': function(event) {
    event.preventDefault();
    $(event.currentTarget)
      .next('[data-toggle-target]')
      .toggleClass('pu-state-active');
    $('[data-toggle-target]')
      .not($(event.currentTarget).next('[data-toggle-target]')[0])
      .removeClass('pu-state-active');
  },
  'click [data-make-admin]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.make_admin',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-admin-added',
      6
    );
  },
  'click [data-make-colleague]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.make_colleague',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-colleague-added',
      7
    );
  },
  'click [data-make-colleague-custom-a]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.make_colleague_custom_a',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-colleague-custom-a-added',
      8
    );
  },
  'click [data-make-colleague-custom-b]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.make_colleague_custom_b',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-colleague-custom-b-added',
      9
    );
  },
  'click [data-remove-admin]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.remove_admin',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-admin-removed',
      6
    );
  },
  'click [data-remove-colleague]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.remove_colleague',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-colleague-removed',
      7
    );
  },
  'click [data-remove-colleague-custom-a]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.remove_colleague_custom_a',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-colleague-custom-a-removed',
      8
    );
  },
  'click [data-remove-colleague-custom-b]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.remove_colleague_custom_b',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-colleague-custom-b-removed',
      9
    );
  },
  'click [data-delete]': function(event, template) {
    event.preventDefault();
    $(event.currentTarget)
      .closest('[data-toggle-target]')
      .toggleClass('pu-state-active');
    template.callMethod(
      'networks.remove_upper',
      template.data.networkSlug,
      this._id,
      this.profile.name,
      'network-settings-uppers-upper-removed'
    );
  },
});

Template.app_profile.onCreated(function() {
  let template = this;

  template.autorun(function() {
    let data = Template.currentData();
    if (!data.profileId) return;
    template.subscribe('users.one', data.profileId, {
      onReady: function() {
        let user = Meteor.users.findOne(data.profileId);

        if (!user || user.deactivatedAt) {
          Router.pageNotFound('profile');
        }

        let isViewable = User(user).aboutPageIsViewable();
        if (!isViewable && Router.current().route.getName() === 'profile') {
          Router.replaceYieldTemplate(
            'app_profile_upper_partups',
            'app_profile'
          );
        }
      },
    });
  });

  template.autorun(function() {
    let scrolled = Partup.client.scroll.pos.get() > 100;
    if (scrolled) {
      if (template.view.isRendered) template.toggleExpandedText(true);
    }
  });

  template.hide = true;

  template.toggleExpandedText = function(hide) {
    let clickedElement = $('[data-expand]');
    if (!clickedElement || !clickedElement[0]) return;
    let parentElement = $(clickedElement[0].parentElement);
    let collapsedText =
      TAPi18n.__(clickedElement.data('collapsed-key')) || false;
    let expandedText = TAPi18n.__(clickedElement.data('expanded-key')) || false;

    if (parentElement.hasClass('pu-state-open')) {
      if (collapsedText) clickedElement.html(collapsedText);
    } else {
      if (expandedText) clickedElement.html(expandedText);
    }
    if (hide) {
      if (collapsedText) clickedElement.html(collapsedText);
      parentElement.removeClass('pu-state-open');
      clickedElement
        .parents('.pu-sub-pageheader')
        .removeClass('pu-state-descriptionexpanded');
    } else {
      parentElement.toggleClass('pu-state-open');
      clickedElement
        .parents('.pu-sub-pageheader')
        .toggleClass('pu-state-descriptionexpanded');
    }

    template.hide = hide;
  };
});

/** ***********************************************************/
/* Page helpers */
/** ***********************************************************/
Template.app_profile.helpers({
  profile: function() {
    let data = Template.currentData();
    let profile = Meteor.users.findOne({ _id: data.profileId });
    if (!profile) return;

    return {
      data: profile.profile,
      hasAboutSection: function() {
        return User(profile).aboutPageIsViewable();
      },
      online: function() {
        if (!profile.status) return false;
        return profile.status.online;
      },
      profileId: function() {
        return data.profileId;
      },
      firstname: function() {
        return User(profile).getFirstname();
      },
      roundedScore: function() {
        return User(profile).getReadableScore();
      },
      hasTilesOrIsCurrentUser: function() {
        let viewable = User(pofile).aboutPageIsViewable();
        return viewable;
      },
      chatIdWithCurrentUser: function() {
        return (Chats.findForUser(Meteor.userId(), { private: true }) || [])
          .map(function(chat) {
            return chat._id;
          })
          .filter(function(chatId) {
            let chats = profile.chats || [];
            return chats.indexOf(chatId) > -1;
          })
          .pop();
      },
      startChatQuery: function() {
        return 'user_id=' + data.profileId;
      },
    };
  },

  selectorSettings: function() {
    let data = Template.currentData();
    let profile = Meteor.users.findOne({ _id: data.profileId });
    if (!profile) return false;

    return {
      _id: data.profileId,
      currentRoute: Router.current().route.getName(),
      firstName: User(profile).getFirstname(),
    };
  },

  shrinkHeader: function() {
    return Partup.client.scroll.pos.get() > 100;
  },
  textHasOverflown: function() {
    let template = Template.instance();
    let rendered = template.partupTemplateIsRendered.get();
    if (!rendered) return;
    let expander = $(template.find('[data-expander-parent]'));
    if (expander.length && expander[0].scrollHeight > expander.innerHeight()) {
      return true;
    }
    return false;
  },
});

/** ***********************************************************/
/* Page events */
/** ***********************************************************/
Template.app_profile.events({
  'click [data-expand]': function(event, template) {
    event.preventDefault();
    template.toggleExpandedText(!template.hide);
  },
  'click [data-open-profilesettings]': function(event, template) {
    event.preventDefault();
    Intent.go({
      route: 'profile-settings',
      params: {
        _id: template.data.profileId,
      },
    });
  },
  'click [data-location]': function(event, template) {
    event.preventDefault();
    let location = Meteor.users.findOne(template.data.profileId).profile
      .location;
    Partup.client.discover.setPrefill('locationId', location.place_id);
    Partup.client.discover.setCustomPrefill('locationLabel', location.city);
    Router.go('discover');
  },
});

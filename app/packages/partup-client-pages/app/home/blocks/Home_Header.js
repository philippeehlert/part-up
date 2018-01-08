Template.Home_Header.onCreated(function() {
  let template = this;

  template.scrollHandler = {
    body: $('body'),
    prevent: 'pu-prevent-scrolling',
    hasPrevent: function() {
      return this.body.hasClass(this.prevent);
    },
    setPrevent: function(bool) {
      if (bool) {
        $('body').addClass(this.prevent);
      } else {
        $('body').removeClass(this.prevent);
      }
    },
    scrollPosition: function() {
      return Partup.client.scroll.pos.get();
    },
    reactiveHeader: function() {
      return template.data.reactiveHeaderExpanded.curValue;
    },
    setReactiveHeader: function(bool) {
      template.data.reactiveHeaderExpanded.set(bool);
    },
    setHomeClicked: function(bool) {
      if (bool) {
        $('[data-what-is-partup]').addClass(
          'pu-home-header__button--is-clicked'
        );
      } else {
        $('[data-what-is-partup]').removeClass(
          'pu-home-header__button--is-clicked'
        );
      }
    },
    setHeaderCollapsed: function(bool) {
      if (bool) {
        $('[data-header]').addClass('pu-home-header--is-collapsed');
      } else {
        $('[data-header]').removeClass('pu-home-header--is-collapsed');
      }
    },
    setState: function(state) {
      if (state === 'top') {
        this.setPrevent(true);
        this.setReactiveHeader(false);
        this.setHomeClicked(false);
        this.setHeaderCollapsed(false);
      } else {
        this.setPrevent(false);
        this.setReactiveHeader(true);
        this.setHomeClicked(true);
        this.setHeaderCollapsed(true);
      }
    },
  };
  this.autorun(function() {
    let handler = template.scrollHandler;
    if (handler.scrollPosition() > 0 && handler.hasPrevent()) {
      handler.setState('scrolled');
    }
  });
  template.scrollHandler.setPrevent(true);
});

Template.Home_Header.onDestroyed(function() {
  $('body').removeClass('pu-prevent-scrolling');
});

Template.Home_Header.helpers({
  greeting: function() {
    let daypart;
    let hour = moment().hours();

    if (hour < 6) daypart = 'night';
    else if (hour < 12) daypart = 'morning';
    else if (hour < 18) daypart = 'afternoon';
    else if (hour < 24) daypart = 'evening';
    else daypart = 'fallback';

    return TAPi18n.__('pages-app-home-loggedin-greeting-' + daypart);
  },
  firstName: function() {
    return User(Meteor.user()).getFirstname();
  },
});

Template.Home_Header.events({
  'click [data-what-is-partup], mousewheel [data-header]': function(
    event,
    template
  ) {
    // event.preventDefault();

    let handler = template.scrollHandler;
    if (handler.reactiveHeader()) {
      return;
    }
    handler.setState('scrolled');
  },
});

Template.Home_Header_CallToAction.events({
  'input [data-register-email]': function(event, template) {
    template.email = $('[data-register-email]').val();
  },
  'click [data-register-button]': function(event, template) {
    Router.go('register', {}, { query: 'email=' + template.email });
  },
  'submit [data-register-form]': function(event, template) {
    event.preventDefault();
    Router.go('register', {}, { query: 'email=' + template.email });
  },
});

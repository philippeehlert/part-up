Template.NetworkChatSidebar.onCreated(function() {
  let template = this;
  template.searchValue = new ReactiveVar(undefined);
});
Template.NetworkChatSidebar.helpers({
  data: function() {
    let template = Template.instance();
    let network = Networks.findOne({
      slug: template.data.config.networkSlug,
    });
    return {
      searchValue: function() {
        return template.searchValue.get();
      },
      activeUppers: function() {
        return Meteor.users.find({
          'status.online': true,
          '_id': { $in: network.uppers || [] },
        });
      },
      network: function() {
        return network;
      },
    };
  },
  state: function() {
    let template = Template.instance();
    let chat = Chats.findOne();
    return {
      started_typing: function(user_id) {
        if (!chat) return false;
        if (!chat.started_typing) return false;
        let typing_user = lodash.find(chat.started_typing, {
          upper_id: user_id,
        });
        if (!typing_user) return false;
        let started_typing_date = new Date(typing_user.date).getTime();
        let now = new Date().getTime();
        return now - started_typing_date < Partup.client.chat.MAX_TYPING_PAUSE;
      },
    };
  },
});
Template.NetworkChatSidebar.events({
  'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]':
    Partup.client.scroll.preventScrollPropagation,
  'input [data-search]': function(event, template) {
    template.data.config.onSearch(event.currentTarget.value);
    template.searchValue.set(event.currentTarget.value);
  },
  'click [data-clear]': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    $('[data-search]').val('');
    _.defer(function() {
      template.data.config.onSearch('');
      template.searchValue.set('');
      $('[data-search]').blur();
    });
  },
});

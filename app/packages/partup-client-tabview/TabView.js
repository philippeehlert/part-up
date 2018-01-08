Template.TabView.onCreated(function() {
  let template = this;
  template.activeTab = new ReactiveVar(template.data.defaultActiveTab || 1);
});

Template.TabView.events({
  'click [data-switch-tab]': function(event, template) {
    let tabNumber = $(event.currentTarget).data('switch-tab');
    template.activeTab.set(tabNumber);
    if (template.data.onToggleTab) template.data.onToggleTab(tabNumber);
  },
});

Template.TabView.helpers({
  state: function() {
    let template = Template.instance();
    return {
      activeTab: function(number) {
        return template.activeTab.get() === number;
      },
      tabButton: function(number) {
        return { 'data-switch-tab': number };
      },
    };
  },
});

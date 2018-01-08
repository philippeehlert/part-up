Template.app_network_start_uppers.onCreated(function() {
  let template = this;
  let upperIds = template.data.uppers.uppers || [];
  template.noUppers = new ReactiveVar(false);
  template.MAX_UPPERS = 7; // 7
  template.subscribe('users.by_ids', upperIds);
  if (!upperIds.length) template.noUppers.set(true);
});
Template.app_network_start_uppers.helpers({
  data: function() {
    let template = Template.instance();
    let upperIds = template.data.uppers.uppers || [];
    let upperCount = template.data.uppers.totalUppers;
    return {
      uppers: function() {
        return Meteor.users.find(
          { _id: { $in: upperIds } },
          { limit: template.MAX_UPPERS }
        );
      },
      remainingUppers: function() {
        let remaining =
          upperCount > template.MAX_UPPERS
            ? upperCount - template.MAX_UPPERS
            : 0;
        return remaining;
      },
      networkSlug: function() {
        return template.data.uppers.networkSlug;
      },
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      noUppers: function() {
        return template.noUppers.get();
      },
    };
  },
});

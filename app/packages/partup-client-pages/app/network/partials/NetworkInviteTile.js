Template.NetworkInviteTile.helpers({
  data: function() {
    let template = Template.instance();
    return {
      networkSlug: function() {
        return template.data.networkSlug;
      },
    };
  },
});

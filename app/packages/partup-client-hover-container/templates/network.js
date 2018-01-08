Template.HoverContainer_network.onCreated(function() {
  let networkSlug = this.data;
});

Template.HoverContainer_network.helpers({
  networkSlug: function() {
    let networkSlug = Template.instance().data;
    if (!networkSlug) return;
    return networkSlug;
  },
});

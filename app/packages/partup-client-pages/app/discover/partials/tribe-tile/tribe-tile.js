Template.TribeTile.helpers({
  data: function() {
    let template = Template.instance();
    let network = template.data.tribe;
    if (!network) return;
    return {
      tribe: function() {
        return network;
      },
      activeUppers: function() {
        return {
          all: network.mostActiveUpperObjects,
          count: network.upper_count,
          networkSlug: self.networkSlug,
          networkId: network._id,
        };
      },
      activePartups: function() {
        return {
          ids: network.most_active_partups,
          count: network.stats.partup_count,
          networkId: network._id,
        };
      },
      displayTags: function() {
        return Partup.client.network.displayTags(network);
      },
    };
  },
});

Template.TribeTile.events({
  'click [data-open-network]': function(event, template) {
    let preventOpen = Partup.client.element.hasAttr(
      event.target,
      'data-prevent-open'
    );
    if (!preventOpen) {
      event.preventDefault();
      let networkSlug = $(event.currentTarget).data('open-network');
      Router.go('network', { slug: networkSlug });
    }
  },
});

Template.TribeTile_Metadata.helpers({
  data: function() {
    let template = Template.instance();
    let partupId = (template.data.partups.ids || [])[0];
    let partups = template.data.partups || {};
    return {
      mostActivePartup: function() {
        return Partups.findOne({ _id: partupId });
      },
      totalActivePartupCount: function() {
        return partups.count;
      },
    };
  },
  state: function() {
    let template = Template.instance();

    return {
      lock: function() {
        return template.data.privacyType > 1;
      },
    };
  },
});

Template.MostActiveUppers.helpers({
  data: function() {
    let MAX_UPPERS = 7;
    let template = Template.instance();
    let uppers = template.data.uppers.all || [];
    let upperCount = template.data.uppers.count;

    return {
      uppers: function() {
        return uppers;
      },
      remainingUppers: function() {
        return upperCount > MAX_UPPERS ? upperCount - MAX_UPPERS : 0;
      },
      networkSlug: function() {
        return template.data.networkSlug;
      },
    };
  },
});

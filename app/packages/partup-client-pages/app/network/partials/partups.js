Template.app_network_start_partups.onCreated(function() {
  let template = this;
  template.MAX_PARTUPS = 3; // 3
  template.activeImage = new ReactiveVar();
  template.noPartups = new ReactiveVar(false);
  let partups = template.data.partups.partups || [];
  let networkId = template.data.partups.networkId;
  if (partups.length) {
    template.subscribe('partups.by_ids', partups, {
      onReady: function() {
        let partup = Partups.find({ _id: { $in: partups } })
          .fetch()
          .shift();
        if (partup) template.activeImage.set(partup.image);
      },
    });
  } else {
    template.subscribe(
      'partups.by_network_id',
      networkId,
      { limit: 3 },
      {
        onReady: function() {
          let partup = Partups.find({ network_id: networkId })
            .fetch()
            .shift();
          if (partup) template.activeImage.set(partup.image);
          else template.noPartups.set(true);
        },
      }
    );
  }
});
Template.app_network_start_partups.helpers({
  data: function() {
    let template = Template.instance();
    let partupIds = template.data.partups.partups || [];
    let networkId = template.data.partups.networkId;
    let partups;
    if (partupIds.length) {
      partups = Partups.find({
        _id: { $in: template.data.partups.partups },
      }).fetch();
    } else partups = Partups.find({ network_id: networkId }).fetch();
    let partupCount = template.data.partups.totalPartups;
    return {
      partups: function() {
        let listPartups = [];
        _.times(template.MAX_PARTUPS, function() {
          if (!partups.length) return;
          let partup = partups.shift();
          partup.activityCount =
            partup.activity_count || Activities.findForPartup(partup).count();
          partup.supporterCount = partup.supporters
            ? partup.supporters.length
            : 0;
          partup.dayCount = Math.ceil(
            (new Date() - new Date(partup.created_at)) / 1000 / 60 / 60 / 24
          );
          listPartups.push(partup);
        });
        return listPartups;
      },
      remainingPartups: function() {
        let remaining =
          partupCount > template.MAX_PARTUPS
            ? partupCount - template.MAX_PARTUPS
            : 0;
        return remaining;
      },
      networkSlug: function() {
        return template.data.partups.networkSlug;
      },
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      activeImage: function() {
        return template.activeImage.get();
      },
      noPartups: function() {
        return template.noPartups.get();
      },
    };
  },
});

Template.app_network_start_partups.events({
  'mouseenter [data-expand]': function(event, template) {
    template.activeImage.set(this.image);
  },
  // 'mouseleave [data-stack]': function(event, template) {
  //     template.activeImage.set(template.data.partups.fetch().shift().image);
  // }
});

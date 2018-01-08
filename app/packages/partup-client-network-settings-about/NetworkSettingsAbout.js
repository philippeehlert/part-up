Template.NetworkSettingsAbout.onCreated(function() {
  let template = this;
  let userId = Meteor.userId();
  let networkSlug = template.data.networkSlug;
  let network;
  template.subscribe('networks.one', template.data.networkSlug, {
    onReady: function() {
      network = Networks.findOne({ slug: template.data.networkSlug });
      if (!network) Router.pageNotFound('network');
      if (network.isClosedForUpper(userId)) {
        Router.pageNotFound('network');
      }
      template.blockSequence = network.contentblocks;
    },
  });
  template.subscribe(
    'contentblocks.by_network_slug',
    template.data.networkSlug,
    {
      onReady: function() {
        let introBlock = ContentBlocks.findOne({ type: 'intro' });
        if (introBlock) return;
        Meteor.call(
          'networks.contentblock_insert',
          template.data.networkSlug,
          { type: 'intro' },
          function(err, blockId) {
            template.editBlock(blockId);
          }
        );
      },
    }
  );

  template.charactersLeft = new ReactiveDict();
  template.submitting = new ReactiveVar();
  template.current = new ReactiveDict();
  template.uploading = new ReactiveDict();
  template.editingBlocks = new ReactiveVar([]);
  template.blockSequence = [];

  template.locationSelection = new ReactiveVar();

  template.viewBlock = function(blockId) {
    if (!blockId) return;
    let editingBlocks = template.editingBlocks.get();
    let index = editingBlocks.indexOf(blockId);
    editingBlocks.splice(index, 1);
    template.editingBlocks.set(editingBlocks);
  };

  template.editBlock = function(blockId) {
    if (!blockId) return;
    let editingBlocks = template.editingBlocks.get();
    editingBlocks.push(blockId);
    template.editingBlocks.set(editingBlocks);
  };

  template.updateBlock = function(blockId, fields, done) {
    Meteor.call(
      'networks.contentblock_update',
      networkSlug,
      blockId,
      fields,
      function(err) {
        if (err && err.message) {
          Partup.client.notify.error(err.reason);
          return;
        }

        Partup.client.notify.success(TAPi18n.__('network-settings-form-saved'));
        template.viewBlock(blockId);
        done();
      }
    );
  };

  template.removeBlock = function(blockId) {
    Partup.client.prompt.confirm({
      title: TAPi18n.__('networksettings-partups-about-change-confirm-title'),
      message: TAPi18n.__(
        'networksettings-partups-about-change-confirm-message'
      ),
      confirmButton: TAPi18n.__(
        'networksettings-partups-about-change-confirm-button-confirm'
      ),
      cancelButton: TAPi18n.__(
        'networksettings-partups-about-change-confirm-button-cancel'
      ),
      onConfirm: function() {
        Meteor.call('networks.contentblock_remove', networkSlug, blockId);
      },
    });
  };

  template.upBlock = function(blockId) {
    let introBlock = ContentBlocks.findOne({ type: 'intro' });
    let sequence = template.blockSequence;
    let currentIndex = sequence.indexOf(blockId);
    if (
      !sequence[currentIndex - 1] ||
      sequence[currentIndex - 1] == introBlock._id
    ) {
      return;
    }
    let memorize = sequence[currentIndex - 1];
    sequence[currentIndex - 1] = blockId;
    sequence[currentIndex] = memorize;
    sequence.unshift(introBlock._id);
    Meteor.call(
      'networks.contentblock_sequence',
      networkSlug,
      sequence,
      function(error, results) {}
    );
  };

  template.downBlock = function(blockId) {
    let introBlock = ContentBlocks.findOne({ type: 'intro' });
    let sequence = template.blockSequence;
    let currentIndex = sequence.indexOf(blockId);
    if (
      !sequence[currentIndex + 1] ||
      sequence[currentIndex + 1] == introBlock._id
    ) {
      return;
    }
    let memorize = sequence[currentIndex + 1];
    sequence[currentIndex + 1] = blockId;
    sequence[currentIndex] = memorize;
    sequence.unshift(introBlock._id);
    Meteor.call(
      'networks.contentblock_sequence',
      networkSlug,
      sequence,
      function(error, results) {}
    );
  };
});

Template.NetworkSettingsAbout.helpers({
  config: function() {
    let template = Template.instance();
    let networkSlug = template.data.networkSlug;
    return {
      introFormSettings: function() {
        return {
          type: 'intro',
          onRemove: template.removeBlock,
          onSubmit: template.updateBlock,
          onClose: template.viewBlock,
        };
      },
      introBlockSettings: function() {
        return {
          onEdit: template.editBlock,
        };
      },
      paragraphFormSettings: function() {
        return {
          type: 'paragraph',
          onRemove: template.removeBlock,
          onSubmit: template.updateBlock,
          onClose: template.viewBlock,
        };
      },
      paragraphBlockSettings: function() {
        return {
          onEdit: template.editBlock,
          onUp: template.upBlock,
          onDown: template.downBlock,
        };
      },
    };
  },
  data: function() {
    let compare = function(a, b) {
      let first = contentBlocksArr.indexOf(a._id);
      let second = contentBlocksArr.indexOf(b._id);
      return first > second ? 1 : -1;
    };
    let template = Template.instance();
    let network = Networks.findOne({ slug: template.data.networkSlug });
    if (!network) return;
    var contentBlocksArr = network.contentblocks || [];
    let introBlock = ContentBlocks.findOne({
      _id: { $in: contentBlocksArr },
      type: 'intro',
    });
    let contentBlocks = ContentBlocks.find({
      _id: { $in: contentBlocksArr },
      type: 'paragraph',
    })
      .fetch()
      .sort(compare);

    template.blockSequence = _.filter(contentBlocksArr, function(item) {
      if (!introBlock) return true;
      return item !== introBlock._id;
    });

    return {
      network: function() {
        return network;
      },
      introBlock: function() {
        return introBlock;
      },
      contentBlocks: function() {
        return contentBlocks;
      },
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      editingBlocks: function() {
        return template.editingBlocks.get();
      },
    };
  },
});

Template.NetworkSettingsAbout.events({
  'click [data-create]': function(event, template) {
    event.preventDefault();
    Meteor.call(
      'networks.contentblock_insert',
      template.data.networkSlug,
      { type: 'paragraph' },
      function(err, blockId) {
        template.editBlock(blockId);
      }
    );
  },
});

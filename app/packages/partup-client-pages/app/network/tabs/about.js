Template.app_network_about.onCreated(function() {
  const { networkSlug } = this.data;
  this.contentblocksAvailable = new ReactiveVar(false);
  this.introBlock = new ReactiveVar(false);
  this.contentBlocks = new ReactiveVar(false);
  this.contentSubscription = this.subscribe(
    'contentblocks.by_network_slug',
    networkSlug
  );
  this.networkSubscription = this.subscribe(
    'admins.by_network_slug',
    networkSlug
  );

  this.autorun((computation) => {
    const ready = !!(
      this.contentSubscription.ready() && this.networkSubscription.ready()
    );
    if (!ready) return;
    const network = Networks.findOne({ slug: networkSlug });
    const {
      contentblocks: contentBlockIds = [],
      tags,
      website,
      location,
    } = network;

    const introBlock = ContentBlocks.findOne({
      _id: { $in: contentBlockIds },
      type: 'intro',
    });
    const contentBlocks = ContentBlocks.find({
      _id: { $in: contentBlockIds },
      type: 'paragraph',
    })
      .fetch()
      .sort((a, b) => {
        return contentBlockIds.indexOf(a._id) > contentBlockIds.indexOf(b._id)
          ? 1
          : -1;
      });

    if (network && introBlock) {
      introBlock.tags = tags || [];
      introBlock.website = website || false;
      introBlock.location = location || false;
    }

    this.introBlock.set(introBlock);
    this.contentBlocks.set(contentBlocks);

    computation.stop(); // stop autorun
  });
});

Template.app_network_about.helpers({
  state(...args) {
    const { contentSubscription, networkSubscription } = Template.instance();
    return {
      loaded: () => contentSubscription.ready() && networkSubscription.ready(),
    };
  },
  data(...args) {
    const {
      data: { networkSlug },
      introBlock,
      contentBlocks,
    } = Template.instance();
    const network = Networks.findOne({ slug: networkSlug });
    const { admins } = network;
    return {
      network: () => network,
      introBlock: () => introBlock.get(),
      contentBlocks: () => contentBlocks.get(),
      admins: () => Meteor.users.find({ _id: { $in: admins } }),
      email: (user) => User(user).getEmail(),
    };
  },
});

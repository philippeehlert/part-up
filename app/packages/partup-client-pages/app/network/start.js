Template.app_network_start.onCreated(function() {
  const { networkSlug: slug } = this.data;
  this.networkLoaded = new ReactiveVar(false);
  this.partupsLoaded = new ReactiveVar(false);
  this.uppersLoaded = new ReactiveVar(false);

  this.subscribe('networks.one', slug, {
    onReady: () => {
      const network = Networks.findOne({ slug });
      if (!network) Router.pageNotFound('network');
      this.networkLoaded.set(true);
    },
  });
  this.subscribe(
    'networks.one.partups',
    { slug },
    {
      onReady: () => this.partupsLoaded.set(true),
    }
  );
  this.subscribe(
    'networks.one.uppers',
    { slug },
    {
      onReady: () => this.uppersLoaded.set(true),
    }
  );

  this.getHeaderHeight = () => {
    return this.$('[data-header]').height();
  };
});

Template.app_network_start.helpers({
  state(...args) {
    const template = Template.instance();
    return {
      networkLoaded: () => template.networkLoaded.get(),
      loaded: () => {
        return !!(
          template.networkLoaded.get() &&
          template.partupsLoaded.get() &&
          template.uppersLoaded.get()
        );
      },
      getHeaderHeight: () => template.getHeaderHeight,
    };
  },
});

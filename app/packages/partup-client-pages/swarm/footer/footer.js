Template.swarm_footer.events({
  'click [data-share-facebook]': function(event, template) {
    let swarm = template.data.swarm;
    let currentUrl = Router.url('swarm', { slug: swarm.slug });
    let shareUrl = Partup.client.socials.generateFacebookShareUrl(currentUrl);
    window.open(shareUrl, 'pop', 'width=600, height=400, scrollbars=no');

    analytics.track('swarm share facebook', {
      swarmId: swarm._id,
    });
  },

  'click [data-share-twitter]': function(event, template) {
    let swarm = template.data.swarm;
    let currentUrl = Router.url('swarm', { slug: swarm.slug });
    let message = swarm.name;
    let shareUrl = Partup.client.socials.generateTwitterShareUrl(
      message,
      currentUrl
    );
    window.open(shareUrl, 'pop', 'width=600, height=400, scrollbars=no');

    analytics.track('swarm share twitter', {
      swarmId: swarm._id,
    });
  },

  'click [data-share-linkedin]': function(event, template) {
    let swarm = template.data.swarm;
    let currentUrl = Router.url('swarm', { slug: swarm.slug });
    let shareUrl = Partup.client.socials.generateLinkedInShareUrl(currentUrl);
    window.open(shareUrl, 'pop', 'width=600, height=400, scrollbars=no');

    analytics.track('swarm share linkedin', {
      swarmId: swarm._id,
    });
  },

  'click [data-share-mail]': function(event, template) {
    let swarm = template.data.swarm;
    let user = Meteor.user();
    let currentUrl = Router.url('swarm', { slug: swarm.slug });
    if (!user) {
      var body = TAPi18n.__('pages-app-swarm-share_mail_anonymous', {
        url: currentUrl,
        swarm_name: swarm.name,
      });
    } else {
      var body = TAPi18n.__('pages-app-swarm-share_mail', {
        url: currentUrl,
        swarm_name: swarm.name,
        user_name: user.profile.name,
      });
    }
    let subject = '';
    let shareUrl = Partup.client.socials.generateMailShareUrl(subject, body);
    window.location.href = shareUrl;

    Meteor.call('swarms.increase_email_share_count', swarm._id);
    analytics.track('swarm share mail', {
      swarmId: swarm._id,
    });
  },
});

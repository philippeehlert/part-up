Template.Start_Chat.helpers({
  data: function() {
    const { networkSlug: slug } = this;
    const {
      _id,
      name: tribename,
      content: { chat_title, chat_body, chat_subtitle } = {},
      admins = [],
      uppers = [],
      most_active_uppers = [],
    } = Networks.findOne({ slug });

    return {
      admins: () => {
        return Meteor.users.find({ _id: { $in: admins } });
      },
      uppers: () => {
        return Meteor.users.find({
          _id: { $nin: admins, $in: most_active_uppers },
        });
      },
      remainingUppers: () => {
        return (
          lodash.size(uppers) -
          lodash.size(lodash.union(most_active_uppers, admins))
        );
      },
      slug,
      chat_title: () =>
        chat_title ||
        TAPi18n.__('pages-app-network-landing-chat-title-fallback', {
          tribename,
        }),
      chat_body: () =>
        chat_body ||
        TAPi18n.__('pages-app-network-landing-chat-body-fallback', {
          tribename,
        }),
      chat_subtitle: () =>
        chat_subtitle ||
        TAPi18n.__('pages-app-network-landing-chat-subtitle-fallback', {
          tribename,
        }),
    };
  },
});

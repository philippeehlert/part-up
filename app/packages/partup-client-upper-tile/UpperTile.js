Template.UpperTile.onCreated(function() {
    const { user } = this.data;

    user.participation_scoreReadable = User(user).getReadableScore();
    user.supporterOf = user.supporterOf || [];
    user.upperOf = user.upperOf || [];
    user.profile.imageObject = user.profile.imageObject || Images.findOne({_id: user.profile.image});
});

Template.UpperTile.helpers({
    chat(...args) {
        const {
            _id,
            profile: {
                chats = [],
            },
        } = Template.instance().data.user;
        const currentUserId = Meteor.userId();
        return {
            chatInstanceIdWithCurrentUser: () => (Chats.findForUser(currentUserId, {private: true}) || [])
                .map(({_id}) => _id)
                .filter((chatId) => chats.indexOf(chatId) > -1)
                .pop(),
            startChatUrlQueryParameters: () => `user_id=${_id}`,
        };
    },
    similarities(...args) {
        const { user } = Template.instance().data;
        const currentUser = Meteor.user();
        const {
            upperOf: userPartups = [],
            supporterOf: userSupporter = [],
            networks: userNetworks = [],
        } = user;
        const {
            upperOf: currentUserPartups = [],
            networks: currentUserNetworks = [],
        } = currentUser;

        return {
            partnerInSamePartupsCount: () => {
                return lodash.size(lodash.intersection(userPartups, currentUserPartups));
            },
            memberOfSameNetworkCount: () => {
                return lodash.size(lodash.intersection(userNetworks, currentUserNetworks));
            },
            supporterOfPartupsCurrentUserIsPartnerOfCount: () => {
                return lodash.size(lodash.intersection(userSupporter, currentUserPartups));
            }
        };
    },
    roleLabel(...args) {
        const { data: { network } } = Template.instance();
        return {
            admin: () => {
                return TAPi18n.__('network-uppers-access-level-label-admin', {
                    label: lodash.get(
                        network,
                        'privacy_type_labels[6]',
                        TAPi18n.__('network-uppers-access-level-label-admin-default')
                    ),
                });
            },
            collegue: () => {
                return TAPi18n.__('network-uppers-access-level-label-collegue', {
                    label: lodash.get(
                        network,
                        'privacy_type_labels[7]',
                        TAPi18n.__('network-uppers-access-level-label-collegue-default')
                    ),
                });
            },
            customA: () => {
                return TAPi18n.__('network-uppers-access-level-label-custom-a', {
                    label: lodash.get(
                        network,
                        'privacy_type_labels[8]',
                        TAPi18n.__('network-uppers-access-level-label-custom-a-default')
                    ),
                });
            },
            customB: () => {
                return TAPi18n.__('network-uppers-access-level-label-custom-b', {
                    label: lodash.get(
                        network,
                        'privacy_type_labels[9]',
                        TAPi18n.__('network-uppers-access-level-label-custom-b-default')
                    ),
                });
            }
        }
    }
});

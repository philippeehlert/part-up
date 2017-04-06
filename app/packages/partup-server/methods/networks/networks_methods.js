Meteor.methods({

    /**
     * Insert a Network
     *
     * @param {mixed[]} fields
     */
    'networks.insert': function(fields) {
        check(fields, Partup.schemas.forms.networkCreate);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var network = {};
            network.name = fields.name;
            network.privacy_type = fields.privacy_type;

            // Check if slug is unique
            network.slug = Partup.server.services.slugify.slugify(fields.name);
            var existingSlug = Networks.findOne({slug: network.slug}, {fields: {slug: 1}});
            if (existingSlug) throw new Meteor.Error('network_slug_already_exists');

            network.uppers = [user._id];
            network.admins = [user._id];
            network.created_at = new Date();
            network.updated_at = new Date();
            network.stats = {
                'activity_count': 0,
                'partner_count': 0,
                'partup_count': 0,
                'supporter_count': 0,
                'upper_count': 1
            };
            network.most_active_uppers = [
                user._id
            ];
            network.most_active_partups = [];
            network.common_tags = [];
            network.contentblocks = [];
            network.partup_names = [];

            // Add sector to network
            var validSector = Sectors.findOne({_id: fields.sector});
            if (validSector) network.sector = fields.sector;

            // Create chat for network
            network.chat_id = Meteor.call('chats.insert', {});
            var chat = Chats.findOneOrFail(network.chat_id);
            chat.addUserToCounter(user._id);

            network._id = Networks.insert(network);

            Meteor.users.update(user._id, {$addToSet: {networks: network._id}});

            return {
                _id: network._id
            };
        } catch (error) {
            if (error.message == '[network_slug_already_exists]') throw new Meteor.Error(400, 'network_slug_already_exists');

            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_inserted');
        }
    },

    /**
     * Update a Network
     *
     * @param {String} networkId
     * @param {mixed[]} fields
     */
    'networks.update': function(networkId, fields) {
        check(networkId, String);
        check(fields, Partup.schemas.forms.network);

        var user = Meteor.user();
        var network = Networks.findOneOrFail(networkId);

        if (!user || !network.isAdmin(user._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var newNetworkFields = Partup.transformers.network.fromFormNetwork(fields);

            Networks.update(networkId, {$set: newNetworkFields});

            return {
                _id: network._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_updated');
        }
    },

    /**
     * Update a Network Access
     *
     * @param {String} networkId
     * @param {mixed[]} fields
     */
    'networks.updateAccess': function(networkId, fields) {
        check(networkId, String);
        check(fields, Partup.schemas.forms.networkAccess);

        var user = Meteor.user();
        var network = Networks.findOneOrFail(networkId);

        if (!user || !network.isAdmin(user._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var newNetworkFields = Partup.transformers.networkAccess.fromFormNetworkAccess(fields);

            Networks.update(networkId, {$set: newNetworkFields});

            return {
                _id: network._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_updated');
        }
    },

    /**
     * Invite someone to a network
     *
     * @param {String} networkId
     * @param {Object} fields
     * @param {Object[]} fields.invitees
     * @param {String} fields.invitees.name
     * @param {String} fields.invitees.email
     * @param {String} fields.message
     */
    'networks.invite_by_email': function(networkId, fields) {
        check(networkId, String);
        check(fields, Partup.schemas.forms.inviteUpper);

        var inviter = Meteor.user();

        if (!inviter) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var network = Networks.findOneOrFail(networkId);

        if (!network.hasMember(inviter._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var invitees = fields.invitees || [];

        invitees.forEach(function(invitee) {
            var isAlreadyInvited = !!Invites.findOne({
                network_id: networkId,
                invitee_email: invitee.email,
                type: Invites.INVITE_TYPE_NETWORK_EMAIL
            });

            if (isAlreadyInvited) {
                //@TODO How to handle this scenario? Because now, we just skip to the next invitee
                //throw new Meteor.Error(403, 'email_is_already_invited_to_network');
                return;
            }

            var accessToken = Random.secret();

            var invite = {
                type: Invites.INVITE_TYPE_NETWORK_EMAIL,
                network_id: network._id,
                inviter_id: inviter._id,
                invitee_name: invitee.name,
                invitee_email: invitee.email,
                message: fields.message,
                access_token: accessToken,
                created_at: new Date
            };

            Invites.insert(invite);

            // Save the access token to the network to allow access
            Networks.update(network._id, {$addToSet: {access_tokens: accessToken}});

            Event.emit('invites.inserted.network.by_email', inviter, network, invitee.email, invitee.name, fields.message, accessToken);
        });
    },

    /**
     * Invite multple uppers to a network
     *
     * @param {String} networkId
     * @param {Object} fields
     * @param {String} fields.csv
     * @param {String} fields.message
     * @param {Object[]} invitees
     */
    'networks.invite_by_email_bulk': function(networkId, fields, invitees) {
        check(networkId, String);
        check(fields, Partup.schemas.forms.networkBulkinvite);

        if (!invitees || (invitees.length < 1 || invitees.length > 200)) {
            throw new Meteor.Error(400, 'invalid_invitees');
        }

        var inviter = Meteor.user();

        if (!inviter) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var network = Networks.findOneOrFail(networkId);

        if (!network.hasMember(inviter._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        // Create invites array
        var invites = invitees.map(function(invitee) {
            var isAlreadyInvited = !!Invites.findOne({
                network_id: network._id,
                invitee_email: invitee.email,
                type: Invites.INVITE_TYPE_NETWORK_EMAIL
            });

            if (isAlreadyInvited) return false;

            var accessToken = Random.secret();

            Networks.update(network._id, {$addToSet: {access_tokens: accessToken}});

            Event.emit('invites.inserted.network.by_email', inviter, network, invitee.email, invitee.name, fields.message, accessToken);

            return {
                type: Invites.INVITE_TYPE_NETWORK_EMAIL,
                network_id: network._id,
                inviter_id: inviter._id,
                invitee_name: invitee.name,
                invitee_email: invitee.email,
                message: fields.message,
                access_token: accessToken,
                created_at: new Date
            };
        });

        // Remove falsy values
        invites = lodash.compact(invites);

        // Insert all invites
        invites.forEach(function(invite) {
            Invites.insert(invite);
        });

        // Return the total count of successful invites
        return invites.length;
    },

    /**
     * Invite an existing upper to an network
     *
     * @param {String} networkId
     * @param {String} inviteeId
     * @param {String} searchQuery
     */
    'networks.invite_existing_upper': function(networkId, inviteeId, searchQuery) {
        check(networkId, String);
        check(inviteeId, String);
        check(searchQuery, Match.Optional(String));

        var inviter = Meteor.user();
        var network = Networks.findOneOrFail(networkId);

        if (!inviter || !network.hasMember(inviter._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        if (network.hasMember(inviteeId)) {
            throw new Meteor.Error(409, 'user_is_already_member_of_network');
        }

        var invitee = Meteor.users.findOneOrFail(inviteeId);

        // Store invite
        var invite = {
            type: Invites.INVITE_TYPE_NETWORK_EXISTING_UPPER,
            network_id: network._id,
            inviter_id: inviter._id,
            invitee_id: invitee._id,
            created_at: new Date
        };

        Invites.insert(invite);

        Event.emit('invites.inserted.network', inviter, network, invitee, searchQuery);
    },

    /**
     * Join a Network
     *
     * @param {String} networkId
     */
    'networks.join': function(networkId) {
        check(networkId, String);

        var user = Meteor.user();
        var network = Networks.findOneOrFail(networkId);

        if (!user) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        if (network.hasMember(user._id)) {
            throw new Meteor.Error(409, 'user_is_already_member_of_network');
        }

        try {
            if (network.isClosed()) {
                // Instantly add user when invited by an admin
                if (network.isUpperInvitedByAdmin(user._id)) {
                    network.addUpper(user._id);
                    Event.emit('networks.uppers.inserted', user, network);
                    return Log.debug('User added to closed network due to admin invite.');
                }

                // Add user to pending if it's a closed network
                network.addPendingUpper(user._id);

                // Send notification to admin
                Event.emit('networks.new_pending_upper', network, user);
                return Log.debug('User (already) added to waiting list');
            }

            if (network.isInvitational()) {
                // Check if the user is invited
                if (network.isUpperInvited(user._id)) {
                    network.addUpper(user._id);
                    Event.emit('networks.uppers.inserted', user, network);
                    return Log.debug('User added to invitational network.');
                } else {
                    if (!network.isUpperPending(user._id)) {
                        // It's an invitational network, so add user as pending at this point to let the admin decide
                        network.addPendingUpper(user._id);

                        // Send notification to admin
                        Event.emit('networks.new_pending_upper', network, user);
                        return Log.debug('User added to waiting list');
                    }

                    return Log.debug('User already added to waiting list');
                }
            }

            if (network.isPublic()) {
                // Allow user instantly
                network.addUpper(user._id);
                Event.emit('networks.uppers.inserted', user, network);
                return Log.debug('User added to public network.');
            }

            return Log.debug('Unknown access level for this network: ' + network.privacy_type);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'user_could_not_join_network');
        }
    },

    /**
     * Accept a request to join network
     *
     * @param {String} networkId
     * @param {String} upperId
     */
    'networks.accept': function(networkId, upperId) {
        check(networkId, String);
        check(upperId, String);

        var user = Meteor.user();
        var network = Networks.findOneOrFail(networkId);

        if (!network.isAdmin(user._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        if (network.hasMember(upperId)) {
            throw new Meteor.Error(409, 'user_is_already_member_of_network');
        }

        try {
            network.acceptPendingUpper(upperId);

            Event.emit('networks.accepted', user._id, networkId, upperId);

            return {
                network_id: network._id,
                upper_id: upperId
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'user_could_not_be_accepted_from_network');
        }
    },

    /**
     * Reject a request to join network
     *
     * @param {String} networkId
     * @param {String} upperId
     */
    'networks.reject': function(networkId, upperId) {
        check(networkId, String);
        check(upperId, String);

        var user = Meteor.user();
        var network = Networks.findOneOrFail(networkId);

        if (!network.isAdmin(user._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            network.rejectPendingUpper(upperId);

            return {
                network_id: network._id,
                upper_id: upperId
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'user_could_not_be_rejected_from_network');
        }
    },

    /**
     * Leave a Network
     *
     * @param {String} networkId
     */
    'networks.leave': function(networkId) {
        check(networkId, String);

        var user = Meteor.user();
        var network = Networks.findOneOrFail(networkId);

        if (!network.hasMember(user._id)) {
            throw new Meteor.Error(400, 'user_is_not_a_member_of_network');
        }

        if (network.isNetworkAdmin(user._id)) {
            throw new Meteor.Error(400, 'network_admin_cant_leave_network');
        }

        try {
            network.leave(user._id);
            Event.emit('networks.uppers.removed', user, network);

            return {
                network_id: network._id,
                upper_id: user._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'user_could_not_be_removed_from_network');
        }
    },

    /**
     * Remove an upper from a network
     *
     * @param {String} networkSlug
     * @param {String} upperId
     */
    'networks.remove_upper': function(networkSlug, upperId) {
        check(networkSlug, String);
        check(upperId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!network.isAdmin(user._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            // Remove user from admin list (if admin)
            if (network.isNetworkAdmin(upperId)) {
                network.removeAdmin(upperId);
            }

            network.leave(upperId);

            return {
                network_id: network._id,
                upper_id: upperId
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'user_could_not_be_removed_from_network');
        }
    },

    /**
     * Return a list of networks based on search query
     *
     * @param {String} query
     */
    'networks.autocomplete': function(query) {
        check(query, String);

        this.unblock();

        var user = Meteor.user();
        if (!user) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            return Networks.guardedMetaFind({name: new RegExp('.*' + query + '.*', 'i')}, {name: 1, limit: 30}).fetch();
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'networks_could_not_be_autocompleted');
        }
    },

    /**
     * Return a list of networks based on search query and swarm
     *
     * @param {String} query
     * @param {String} swarmSlug
     */
    'networks.autocomplete_swarm': function(query, swarmSlug) {
        check(query, String);

        this.unblock();

        var user = Meteor.user();
        if (!user) {
            throw new Meteor.Error(401, 'unauthorized');
        }
        var swarm = Swarms.guardedMetaFind({slug: swarmSlug}, {limit: 1}).fetch().pop();
        try {
            return Networks.guardedMetaFind({
                name: new RegExp('.*' + query + '.*', 'i'),
                swarms: {$nin: [swarm._id]}
            }, {name: 1, limit: 30}).fetch();
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'networks_could_not_be_autocompleted');
        }
    },

    /**
     * Get user suggestions for a given network
     *
     * @param {String} networkSlug
     * @param {Object} options
     * @param {String} options.query
     * @param {Boolean} options.invited_in_network
     * @param {Number} options.limit
     * @param {Number} options.skip
     *
     * @return {Array}
     */
    'networks.user_suggestions': function(networkSlug, options) {
        check(networkSlug, String);
        check(options, {
            query: Match.Optional(String),
            invited_in_network: Match.Optional(String),
            limit: Match.Optional(Number),
            skip: Match.Optional(Number)
        });

        this.unblock();

        var upper = Meteor.user();

        if (!upper) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var users = Partup.server.services.matching.matchUppersForNetwork(networkSlug, options);

        // We are returning an array of IDs instead of an object
        return users.map(function(user) {
            return user._id;
        });
    },

    /**
     * Remove a Network
     *
     * @param {String} networkId
     */
    'networks.remove': function(networkId) {
        check(networkId, String);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var network = Networks.findOneOrFail(networkId);
        if (network.uppers.length > 1) {
            throw new Meteor.Error(400, 'network_contains_uppers');
        }

        var networkPartups = Partups.find({network_id: networkId});
        if (networkPartups.count() > 0) {
            throw new Meteor.Error(400, 'network_contains_partups');
        }

        try {
            Networks.remove(networkId);
            Chats.removeFull(network.chat_id);
            Meteor.users.update(user._id, {$pull: {networks: network._id}});
            var network_swarms = Swarms.find({networks: {$in: [networkId]}}).fetch();
            network_swarms.forEach(function(swarm) {
                Swarms.update(swarm._id, {$pull: {networks: networkId}});
            });

            return {
                _id: networkId
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_removed');
        }
    },

    /**
     * Update privileged network fields (superadmin only)
     *
     * @param {String} networkSlug
     * @param {mixed[]} fields
     */
    'networks.admin_update': function(networkSlug, fields) {
        check(networkSlug, String);
        check(fields, Partup.schemas.forms.networkEdit);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');
        if (!User(user).isAdmin()) throw new Meteor.Error(401, 'unauthorized');

        var network = Networks.findOneOrFail({slug: networkSlug});

        try {
            Networks.update(network._id, {$set: fields});
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_updated');
        }
    },

    /**
     * Consume an access token and add the user to the invites
     *
     * @param {String} networkSlug
     * @param {String} accessToken
     * */
    'networks.convert_access_token_to_invite': function(networkSlug, accessToken) {
        check(networkSlug, String);
        check(accessToken, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        try {
            network.convertAccessTokenToInvite(user._id, accessToken);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_access_token_could_not_be_converted_to_invite');
        }
    },

    /**
     * Give a user admin rights
     *
     * @param {String} networkSlug
     * @param {String} userId
     * */
    'networks.make_admin': function(networkSlug, userId) {
        check(networkSlug, String);
        check(userId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});
        if (!user || !network.isAdmin(user._id) || network.isNetworkColleague(userId)) throw new Meteor.Error(401, 'unauthorized');

        try {
            if (network.hasMember(userId)) {
                if (network.admins.length > 10) throw new Meteor.Error(400, 'network_admin_limit_reached');
                network.addAdmin(userId);
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_user_could_not_be_made_admin');
        }
    },

    /**
     * Remove admin rights from user
     *
     * @param {String} networkSlug
     * @param {String} userId
     * */
    'networks.remove_admin': function(networkSlug, userId) {
        check(networkSlug, String);
        check(userId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!user || !network.isAdmin(user._id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            if (network.hasMember(userId) && network.admins.length > 1) {
                network.removeAdmin(userId);
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_user_could_not_be_removed_as_admin');
        }
    },

    /**
     * Insert a ContentBlock
     *
     * @param {String} networkSlug
     * @param {mixed[]} fields
     */
    'networks.contentblock_insert': function(networkSlug, fields) {
        check(networkSlug, String);
        check(fields, Partup.schemas.forms.contentBlock);

        var user = Meteor.user();
        var network = Networks.findOneOrFail({slug: networkSlug});

        if (!user || !network.isAdmin(user._id)) throw new Meteor.Error(401, 'unauthorized');

        // Only 1 'intro' type allowed
        if (fields.type === 'intro') {
            var introBlock = ContentBlocks.findOne({_id: {$in: network.contentblocks || []}, type: 'intro'});
            if (introBlock) throw new Meteor.Error(400, 'network_contentblocks_intro_already_exists');
        }

        try {
            var contentBlockFields = Partup.transformers.contentBlock.fromFormContentBlock(fields);
            var contentBlock = Meteor.call('contentblocks.insert', contentBlockFields);
            Networks.update(network._id, {$addToSet: {contentblocks: contentBlock._id}});

            return contentBlock._id;
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_contentblocks_could_not_be_inserted');
        }
    },

    /**
     * Update a ContentBlock
     *
     * @param {String} networkSlug
     * @param {String} contentBlockId
     * @param {mixed[]} fields
     */
    'networks.contentblock_update': function(networkSlug, contentBlockId, fields) {
        check(networkSlug, String);
        check(fields, Partup.schemas.forms.contentBlock);

        var user = Meteor.user();
        var network = Networks.findOneOrFail({slug: networkSlug});

        if (!user || !network.isAdmin(user._id) || !network.hasContentBlock(contentBlockId)) throw new Meteor.Error(401, 'unauthorized');

        try {
            Meteor.call('contentblocks.update', contentBlockId, fields);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_contentblocks_could_not_be_updated');
        }
    },

    /**
     * Remove a ContentBlock
     *
     * @param {String} networkSlug
     * @param {String} contentBlockId
     */
    'networks.contentblock_remove': function(networkSlug, contentBlockId) {
        check(networkSlug, String);
        check(contentBlockId, String);

        var user = Meteor.user();
        var network = Networks.findOneOrFail({slug: networkSlug});

        if (!user || !network.isAdmin(user._id) || !network.hasContentBlock(contentBlockId)) throw new Meteor.Error(401, 'unauthorized');

        try {
            Networks.update(network._id, {$pull: {contentblocks: contentBlockId}});
            ContentBlocks.remove(contentBlockId);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_contentblocks_could_not_be_removed');
        }
    },

    /**
     * Update a ContentBlock sequence
     *
     * @param {String} networkSlug
     * @param {String[]} contentBlockSequence
     */
    'networks.contentblock_sequence': function(networkSlug, contentBlockSequence) {
        check(networkSlug, String);
        check(contentBlockSequence, [String]);

        var user = Meteor.user();
        var network = Networks.findOneOrFail({slug: networkSlug});

        if (!user || !network.isAdmin(user._id)) throw new Meteor.Error(401, 'unauthorized');

        // Check if length of new array is the same as the current length
        if (network.contentblocks.length !== contentBlockSequence.length) throw new Meteor.Error(400, 'network_contentblocks_not_matching');

        // Check if given IDs are legit
        contentBlockSequence.forEach(function(contentBlockId) {
            if (!network.hasContentBlock(contentBlockId)) throw new Meteor.Error(401, 'unauthorized');
        });

        try {
            Networks.update(network._id, {$set: {contentblocks: contentBlockSequence}});
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_contentblocks_could_not_be_updated');
        }
    },

    /**
     * Archive a network
     *
     * @param {String} networkSlug
     * */
    'networks.archive': function(networkSlug) {
        check(networkSlug, String);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) throw new Meteor.Error(401, 'unauthorized');
        var network = Networks.findOne({slug: networkSlug});

        try {
            Networks.update(network._id, {$set: {archived_at: new Date()}});
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'network_could_not_be_archived');
        }
    },

    /**
     * Unarchive a network
     *
     * @param {String} networkSlug
     */
    'networks.unarchive': function(networkSlug) {
        check(networkSlug, String);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) throw new Meteor.Error(401, 'unauthorized');
        var network = Networks.findOne({slug: networkSlug});

        try {
            Networks.update(network._id, {$unset: {archived_at: ''}});
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'network_could_not_be_unarchived');
        }
    },

    /**
     * Give a user colleague rights
     *
     * @param {String} networkSlug
     * @param {String} userId
     * */
    'networks.make_colleague': function(networkSlug, userId) {
        check(networkSlug, String);
        check(userId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!user || !network.isAdmin(user._id) || network.isNetworkAdmin(userId)) throw new Meteor.Error(401, 'unauthorized');

        try {
            if (network.hasMember(userId)) {
                network.addColleague(userId);
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_user_could_not_be_made_colleague');
        }
    },

    /**
     * Give a user colleague-custom-a rights
     *
     * @param {String} networkSlug
     * @param {String} userId
     * */
    'networks.make_colleague_custom_a': function(networkSlug, userId) {
        check(networkSlug, String);
        check(userId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!user || !network.isAdmin(user._id) || network.isNetworkAdmin(userId)) throw new Meteor.Error(401, 'unauthorized');

        try {
            if (network.hasMember(userId)) {
                network.addColleagueCustomA(userId);
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_user_could_not_be_made_colleague');
        }
    },

    /**
     * Give a user colleague rights
     *
     * @param {String} networkSlug
     * @param {String} userId
     * */
    'networks.make_colleague_custom_b': function(networkSlug, userId) {
        check(networkSlug, String);
        check(userId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!user || !network.isAdmin(user._id) || network.isNetworkAdmin(userId)) throw new Meteor.Error(401, 'unauthorized');

        try {
            if (network.hasMember(userId)) {
                network.addColleagueCustomB(userId);
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_user_could_not_be_made_colleague');
        }
    },

    /**
     * Remove user from colleague list
     *
     * @param {String} networkSlug
     * @param {String} userId
     * */
    'networks.remove_colleague': function(networkSlug, userId) {
        check(networkSlug, String);
        check(userId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!user || !network.isAdmin(user._id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            if (network.hasMember(userId)) {
                network.removeColleague(userId);
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_user_could_not_be_removed_as_colleague');
        }
    },

    /**
     * Remove user from colleague list
     *
     * @param {String} networkSlug
     * @param {String} userId
     * */
    'networks.remove_colleague_custom_a': function(networkSlug, userId) {
        check(networkSlug, String);
        check(userId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!user || !network.isAdmin(user._id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            if (network.hasMember(userId)) {
                network.removeColleagueCustomA(userId);
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_user_could_not_be_removed_as_colleague');
        }
    },

    /**
     * Remove user from colleague list
     *
     * @param {String} networkSlug
     * @param {String} userId
     * */
    'networks.remove_colleague_custom_b': function(networkSlug, userId) {
        check(networkSlug, String);
        check(userId, String);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!user || !network.isAdmin(user._id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            if (network.hasMember(userId)) {
                network.removeColleagueCustomB(userId);
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_user_could_not_be_removed_as_colleague');
        }
    },

    /**
     * Update the contents on the network frontpage
     *
     * @param {String} networkSlug
     * @param {mixed[]} fields
     * */
    'networks.update_content': function(networkSlug, fields) {
        check(networkSlug, String);
        check(fields, Partup.schemas.forms.networkContent);

        var user = Meteor.user();
        var network = Networks.findOne({slug: networkSlug});

        if (!user || !network.isAdmin(user._id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            Networks.update(network._id, {
                $set: {
                    content: {
                        video_url: fields.video_url,
                        why_title: fields.why_title,
                        why_body: fields.why_body,
                        about_title: fields.about_title,
                        about_body: fields.about_body
                    }
                }
            });

            return {
                _id: network._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_content_could_not_be_updated');
        }
    }
});

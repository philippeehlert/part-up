/**
 * Manages the data of chats and chat-menu
 *
 * @class chatData
 * @memberof Partup.client
 */
Partup.client.chatData = {
    images: [],
    users: [],
    networks: [],
    chats: [],
    mappedChats: [],
    chatIds: [],
    networkChatIds: [],
    unreadSubscriptionReady: new ReactiveVar(false),

    /**
     * Initializes the chatdata manager and fetches for the first time
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    initialize: function(cb) {
        Partup.client.chatData.refetch(function(chatIds) {
            cb(chatIds);
        });
    },

    /**
     * Fetches chatData
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    fetchuserData: function(cb) {
        const query = {
            token: Accounts._storedLoginToken(),
            archived: false
        };
        HTTP.get('/chats/userdata' + mout.queryString.encode(query), function(error, response) {
            if (error) throw error;
            cb(response);
        });
    },

    /**
     * Refetches chatdata
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    refetch: function(cb) {
        // set loading state
        Partup.client.chatData.unreadSubscriptionReady.set(false);
        lodash.defer(function() {
            // fetch data
            Partup.client.chatData.fetchuserData(function(response) {
                // store data
                Partup.client.chatData.parseUserData(response, function(chatIds) {
                    // unset loading state
                    // Partup.client.chatData.unreadSubscriptionReady.set(true);
                    cb(chatIds);
                });
            });
        })
    },

    /**
     * Parses chatdata and stores it
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    parseUserData: function(response, cb) {
        var self = Partup.client.chatData;
        var userId = Meteor.userId();
        // read and store data
        self.images = lodash.get(response, "data['cfs.images.filerecord']", []);
        self.users = lodash.get(response, 'data.users', []).map(function(item) {
            item.imageObj = lodash.find(self.images, {_id: item.profile.image});
            return item;
        });
        self.fireUsersData();
        self.networks = lodash.get(response, 'data.networks', []).map(function(item) {
            item.imageObj = lodash.find(self.images, {_id: item.image});
            return item;
        });
        self.chats = lodash.get(response, 'data.chats', []);

        // populate stored chats with users and networks data
        // used later to populate reactive chat collections
        self.mappedChats = self.chats.map(function(chat) {
            self.chatIds.push(chat._id);
            chat.chatter = self.users.filter(function(user) {
                if (!user.chats) return false;
                if (user._id === userId) return false;
                return user.chats.indexOf(chat._id) > -1;
            }).pop();
            chat.network = lodash.find(self.networks, {chat_id: chat._id});
            return chat;
        });

        // store network chat ids
        // these can be used to differentiate
        // between private and network chats
        self.networkChatIds = self.networks.map(function(network) {
            return network.chat_id;
        });

        cb(self.chatIds);
    },

    /**
     * Populates a chats collection with the static data in chatData memory
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    populateChatData: function(chat) {
        chat.static = Partup.client.chatData.findChat({_id: chat._id});
        chat.latestMessage = ChatMessages.find({chat_id: chat._id}, {sort: {created_at: -1}, limit: 1}).fetch().pop();
        return chat;
    },

    /**
     * Find chat in stored populated chats
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    findChat: function(opts) {
        return lodash.find(Partup.client.chatData.mappedChats, opts);
    },

    _userDataListeners: [],
    /**
     * Registers callback for userdata
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    onUsersData: function(cb) {
        Partup.client.chatData._userDataListeners.push(cb);
        if (Partup.client.chatData.users.length) cb(Partup.client.chatData.users);
    },

    /**
     * unregisters callback for userdata
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    offUsersData: function(cb) {
        const index = Partup.client.chatData._userDataListeners.indexOf(cb);
        Partup.client.chatData._userDataListeners.splice(index, 1);
    },

    /**
     * fires callbacks for userdata
     *
     * @memberof Partup.client.chatData
     * @param {Function} callback
     */
    fireUsersData: function() {
        Partup.client.chatData._userDataListeners.forEach(function(cb) {
            cb(Partup.client.chatData.users);
        });
    },

    clear() {
        Partup.client.chatData.images = [];
        Partup.client.chatData.users = [];
        Partup.client.chatData.networks = [];
        Partup.client.chatData.chats = [];
        Partup.client.chatData.mappedChats = [];
        Partup.client.chatData.chatIds = [];
        Partup.client.chatData.networkChatIds = [];
        Partup.client.chatData.unreadSubscriptionReady = new ReactiveVar(false);
        Partup.client.chatData._userDataListeners = [];
    }
};

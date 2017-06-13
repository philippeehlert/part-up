var _prefill = {};
var _customPrefill = {};

var _tribe_prefill = {};
var _tribe_customPrefill = {};

/**
 * Helper for discover page
 *
 * @class discover
 * @memberof Partup.client
 */
Partup.client.discover = {

    DEFAULT_QUERY: {
        textSearch: undefined,
        networkId: undefined,
        locationId: undefined,
        sort: 'new',
        language: undefined
    },

    current_query: {
        textSearch: undefined,
        networkId: undefined,
        locationId: undefined,
        sort: 'new',
        language: undefined
    },

    DEFAULT_TRIBE_QUERY: {
        textSearch: undefined,
        locationId: undefined,
        sort: 'popular',
        type: undefined,
        sector_id: undefined,
        language: undefined
    },

    current_tribe_query: {
        textSearch: undefined,
        locationId: undefined,
        sort: 'popular',
        type: undefined,
        sector_id: undefined,
        language: undefined
    },

    /*
     * Current discover query ReactiveVar
     *
     * @memberof Partup.client.discover
     *
     */
    query: new ReactiveDict(),

    tribe_query: new ReactiveDict(),

    /*
     * Compose query object from ReactiveDict (reactive source)
     */
    composeQueryObject: function() {
        var queryObj = {};

        for (key in this.DEFAULT_QUERY) {
            var value = this.query.get(key);
            if (!value) continue;

            queryObj[key] = value;
        }

        return queryObj;
    },

    /*
     * Compose query object from ReactiveDict (reactive source)
     */
    composeTribeQueryObject: function() {
        var queryObj = {};

        for (key in this.DEFAULT_TRIBE_QUERY) {
            var value = this.tribe_query.get(key);
            if (!value) continue;

            queryObj[key] = value;
        }

        return queryObj;
    },

    /*
     * Reset discover query
     *
     * @memberof Partup.client.discover
     *
     */
    resetQuery: function() {
        for (key in this.DEFAULT_QUERY) {
            this.query.set(key, this.DEFAULT_QUERY[key]);
        }
        this.current_query = JSON.parse(JSON.stringify(this.DEFAULT_QUERY));
    },
    resetTribeQuery: function() {
        for (key in this.DEFAULT_TRIBE_QUERY) {
            this.tribe_query.set(key, this.DEFAULT_TRIBE_QUERY[key]);
        }
        this.current_tribe_query = JSON.parse(JSON.stringify(this.DEFAULT_TRIBE_QUERY));
    },

    /*
     * Helper to set prefill value
     */
    setPrefill: function(key, value) {
        if (!Partup.client.discover.DEFAULT_QUERY.hasOwnProperty(key)) {
            throw new Error('Discover query key "' + key + '" is not defined in Partup.client.discover.DEFAULT_QUERY');
        }

        _prefill[key] = value;
    },
    setTribePrefill: function(key, value) {
        if (!Partup.client.discover.DEFAULT_TRIBE_QUERY.hasOwnProperty(key)) {
            throw new Error('Discover query key "' + key + '" is not defined in Partup.client.discover.DEFAULT_QUERY');
        }

        _tribe_prefill[key] = value;
    },

    /*
     * Prefill the query with set values
     */
    prefillQuery: function() {
        for (key in this.DEFAULT_QUERY) {
            var value = _prefill[key];
            if (!value) { continue; }
            this.query.set(key, value);
        }
        _.defer(function() {
            _prefill = {};
        });
    },

    /*
     * Prefill the query with set values
     */
    prefillTribeQuery: function() {
        for (key in this.DEFAULT_TRIBE_QUERY) {
            var value = _tribe_prefill[key];
            if (!value) { continue; }
            this.tribe_query.set(key, value);
        }
        _.defer(function() {
            _tribe_prefill = {};
        });
    },

    /*
     * Set custom prefill data
     */
    setCustomPrefill: function(key, value) {
        _customPrefill[key] = value;
    },
    setCustomTribePrefill: function(key, value) {
        _tribe_customPrefill[key] = value;
    },

    /*
     * Get and clear custom prefill data
     */
    getCustomPrefill: function() {
        var copy = _customPrefill;
        _customPrefill = {};
        return copy;
    },
    getCustomTribePrefill: function() {
        var copy = _tribe_customPrefill;
        _tribe_customPrefill = {};
        return copy;
    }

};

Partup.client.discover.resetQuery();
Partup.client.discover.resetTribeQuery();

Template.TribeTile.helpers({
    data: function() {
        var template = Template.instance();
        var network = template.data.tribe;
        if (!network) return;
        return {
            tribe: function() {
                return network;
            },
            activeUppers: function() {
                return {
                    all: network.mostActiveUpperObjects,
                    count: network.stats.upper_count,
                    networkSlug: self.networkSlug,
                    networkId: network._id
                };
            },
            activePartups: function() {
                return {
                    ids: network.most_active_partups,
                    count: network.stats.partup_count,
                    networkId: network._id
                };
            },
            displayTags: function() {
                return Partup.client.network.displayTags(network);
            }
        };
    }
});

Template.TribeTile.events({
    'click [data-open-network]': function(event, template) {
        var preventOpen = Partup.client.element.hasAttr(event.target, 'data-prevent-open');
        if (!preventOpen) {
            event.preventDefault();
            var networkSlug = $(event.currentTarget).data('open-network');
            Router.go('network', {slug: networkSlug});
        }
    }
});

Template.TribeTile_Metadata.helpers({
    data: function() {
        var template = Template.instance();
        var partupId = (template.data.partups.ids || [])[0];
        var partups = template.data.partups || {};
        return {
            mostActivePartup: function() {
                return Partups.findOne({_id: partupId});
            },
            totalActivePartupCount: function() {
                return partups.count;
            }
        };
    },
    state: function() {
        var template = Template.instance();

        return {
            lock: function() {
                return template.data.privacyType > 1;
            }
        };
    }
});

Template.MostActiveUppers.helpers({
    data: function() {
        var MAX_UPPERS = 7;
        var template = Template.instance();
        var uppers = template.data.uppers.all || [];
        var upperCount = template.data.uppers.count;
        return {
            uppers: function() {
                return uppers;
            },
            remainingUppers: function() {
                return upperCount > MAX_UPPERS ? (upperCount - MAX_UPPERS) : 0;
            },
            networkSlug: function() {
                return template.data.networkSlug;
            }
        };
    }
});

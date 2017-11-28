Template.Tag.helpers({
    typeClass: () => {
        const { type } = Template.instance().data || {};

        switch (type) {
            case 'inverted':
                return 'pu-tag-inverted';
            case 'angular':
                return 'pu-tag-angular';
            case 'contribution':
                return 'pu-tag-contribution';
            case 'contribution-amount':
                return 'pu-tag-contribution-amount';
            case 'metadata':
                return 'pu-tag-metadata';
            case 'dark':
                return 'pu-tag-dark';
            default:
                return '';
        }
    },
    clickableClass: () => {
        const { query } = Template.instance().data || {};

        if (query) return 'pu-tag-clickable';

        return '';
    },
});

Template.Tag.events({
    'click [data-tag]': (event, templateInstance) => {
        const { data } = templateInstance;

        if (!data.query) return;

        event.preventDefault();
        event.stopPropagation();

        
        switch (data.context) {
            case 'discover-partups':
                Partup.client.discover.setPrefill('textSearch', data.query);
                Router.go('discover-partups');
                break;
            case 'discover-tribes':
                Partup.client.discover.setTribePrefill('textSearch', data.query);
                Router.go('discover');
                break;
            case 'tribe-search':
                Router.go(`/tribes/${data.slug}/partups?tag=${data.query}`);
                break;
            // case 'activity':
            //     Partup.client.discover.setTribePrefill('textSearch', data.query);
            //     Router.go('discover');
            //     break;
        }
    },
});
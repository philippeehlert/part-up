Template.app_partup.onCreated(function () {
    const template = this;

    template.network = new ReactiveVar(undefined);
    template.partup = new ReactiveVar(undefined, (oldVal, newVal) => {
        template.network.set(newVal ? Networks.findOne(newVal.network_id) : undefined);
        if (newVal) {
            // this throws an error on chrome about a subscription
            // It's very important to keep this in order for the updates to keep working
            if (typeof newVal._id === 'string') {
                Partup.client.updates.firstUnseenUpdate(newVal._id).set();
            }
        }
        template.loading.partup.set(false);
    });

    template.loading = {
        partup: new ReactiveVar(true),
        activities: new ReactiveVar(true),
        updates: new ReactiveVar(true),
        board: new ReactiveVar(true),
    };

    const sidebarCookie = Cookies.get('partup_sidebar_expanded');
    const sidebarState =
        sidebarCookie !== undefined
            ? sidebarCookie.toBool()
            : !Partup.client.isMobile.isTabletOrMobile();

    template.sidebarExpanded = new ReactiveVar(sidebarState, (oldVal, newVal) => {
        Cookies.set('partup_sidebar_expanded', newVal, { expires: Infinity });
    });

    window.addEventListener('orientationchange', () => {
        switch (window.orientation) {
            case 90 || -90:
                // landscape
                template.sidebarExpanded(true);
                break;
            default:
                // portrait
                template.sidebarExpanded(false);
                break;
        }
    });

    template.autorun(function () {
        const partupId = Template.currentData().partupId;
        const accessToken = Session.get('partup_access_token');

        Meteor.subscribe('partups.one', partupId, accessToken, {
            onReady() {
                const partup = Partups.findOne(partupId);
                if (partup) {
                    if (!partup.isViewableByUser(Meteor.userId(), Session.get('partup_access_token'))) {
                        return Router.pageNotFound('partup-closed');
                    }
                    return template.partup.set(partup);
                }
                
                return Router.pageNotFound('partup');
            },
        });

        template.subscribe('activities.from_partup', partupId, accessToken, {
            onReady() {
                template.loading.activities.set(false);
            },
        });

        template.subscribe('updates.from_partup', partupId, {}, accessToken, {
            onReady() {
                template.loading.updates.set(false);
            },
        });
        template.subscribe('board.for_partup_id', partupId, accessToken, {
            onReady() {
                template.loading.board.set(false);
            },
        });
    });
});

Template.app_partup.helpers({
    network() {
        return Template.instance().network.get();
    },
    partup() {
        return Template.instance().partup.get();
    },
    partupLoaded() {
        const loading = Template.instance().loading;
        return !loading.partup.get() && !loading.activities.get() && !loading.updates.get() && !loading.board.get();
    },
    sidebarExpanded() {
        return Template.instance().sidebarExpanded.get();
    },
    scrollHorizontal() {
        return Router.current().route.getName() === 'partup-activities' && (Template.instance().partup.get() && Template.instance().partup.get().board_view);
    },
});

Template.app_partup.events({
    'click [data-toggle-sidebar]': (event, templateInstance) => {
        event.preventDefault();
        templateInstance.sidebarExpanded.set(!templateInstance.sidebarExpanded.curValue);
    },
});

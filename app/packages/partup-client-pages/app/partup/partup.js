Template.app_partup.onCreated(function () {
    var template = this;

    template.network = new ReactiveVar(undefined);
    template.partup = new ReactiveVar(undefined, (oldVal, newVal) => {
        template.loading.partup.set(false);

        template.network.set(
            newVal ?
                Networks.findOne(newVal.network_id) :
                undefined);
    });

    template.loading = {
        partup: new ReactiveVar(true),
        activities: new ReactiveVar(true),
        updates: new ReactiveVar(true),
        board: new ReactiveVar(true)
    };

    function setClass(state, $elem, className) {
        state ?
            $elem.hasClass(className) ?
                undefined :
                $elem.addClass(className) :
            $elem.hasClass(className) ?
                $elem.removeClass(className) :
                undefined;
    }

    const sidebarCookie = Cookies.get('partup_sidebar_expanded');
    const sidebarState = 
        sidebarCookie !== undefined
            ? sidebarCookie.toBool()
            : Partup.client.isMobile.isTabletOrMobile()
                ? false
                : true;

    template.sidebarExpanded = new ReactiveVar(sidebarState, (oldVal, newVal) => {
        Cookies.set('partup_sidebar_expanded', newVal, { expires: Infinity });
    });

    template.autorun(function () {
        const partupId = Template.currentData().partupId;
        const accessToken = Session.get('partup_access_token');

        Meteor.subscribe('partups.one', partupId, accessToken, {
            onReady: function () {
                const partup = Partups.findOne(partupId);

                if (!partup) {
                    return Router.pageNotFound('partup');
                }
                if (!partup.isViewableByUser(Meteor.userId(), Session.get('partup_access_token'))) {
                    return Router.pageNotFound('partup-closed');
                }

                template.partup.set(partup);
            },
        });

        template.subscribe('activities.from_partup', partupId, accessToken, {
            onReady: function () {
                template.loading.activities.set(false);
            },
        });
        template.subscribe('updates.from_partup', partupId, accessToken, {
            onReady: function () {
                template.loading.updates.set(false);
            },
        });
        template.subscribe('board.for_partup_id', partupId, accessToken, {
            onReady: function () {
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
    }
});

Template.app_partup.events({
    'click [data-toggle-sidebar]': function (event, template) {
        event.preventDefault();
        template.sidebarExpanded.set(!template.sidebarExpanded.curValue);
    },
});

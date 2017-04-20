Template.Start_Nav.onCreated(function() {
    this.attached = new ReactiveVar(false);
    this.fadeIn = new ReactiveVar(false);

    this.calculateAttached = () => {
        const { getHeaderHeight } = this.data;
        const headerHeight = getHeaderHeight();

        // compensate for different navbar styling on small screens
        const diff = window.innerWidth < 992 ? 60 : 0;

        this.attached.set(!!(
            Partup.client.scroll.pos.get() > (headerHeight + diff)
        ));
    };

    this.autorun(this.calculateAttached);
    $(window).on('resize', this.calculateAttached);

});

Template.Start_Nav.onRendered(function() {
    lodash.defer(() => this.fadeIn.set(true));
});

Template.Start_Nav.onDestroyed(function() {
    $(window).off('resize', this.calculateAttached);
})

Template.Start_Nav.events({
    'click [data-anchor]': function(event, template) {
        const { pathname, search } = window.location;
        lodash.defer(() => Router.go(`${pathname}${search}`));
    }
})

Template.Start_Nav.helpers({
    state(...args) {
        const { attached, fadeIn } = Template.instance();

        return {
            attached: () => attached.get(),
            fadeIn: () => fadeIn.get(),
        };
    },
});

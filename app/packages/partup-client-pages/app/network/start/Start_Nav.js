Template.Start_Nav.onCreated(function() {
    this.attached = new ReactiveVar(false);

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

Template.Start_Nav.onDestroyed(function() {
    $(window).off('resize', this.calculateAttached);
})

Template.Start_Nav.helpers({
    state(...args) {
        const { attached } = Template.instance();

        return {
            attached: () => attached.get(),
        };
    },
});

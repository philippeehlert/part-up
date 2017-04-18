Template.Start_Nav.onCreated(function() {
    this.attached = new ReactiveVar(false);
    console.log(this)

    this.calculateAttached = () => {
        const { getHeaderHeight } = this.data;
        const headerHeight = getHeaderHeight();

        const diff = window.innerWidth < 768 ? 60 : 0;

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

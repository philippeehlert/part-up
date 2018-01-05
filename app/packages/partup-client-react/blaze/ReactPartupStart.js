Template.ReactPartupStart.onRendered(function() {
    window.RENDER_REACT('react-partup-start-root', 'partup-start', this.data || {});
});

Template.ReactPartupStart.onDestroyed(() => {
    window.UNRENDER_REACT('react-partup-start-root', 'partup-start');
});

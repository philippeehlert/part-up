Template.ReactPartupStart.onRendered(() => {
    window.RENDER_REACT('react-partup-start-root', 'partup-start');
});

Template.ReactPartupStart.onDestroyed(() => {
    window.UNRENDER_REACT('react-partup-start-root', 'partup-start');
});

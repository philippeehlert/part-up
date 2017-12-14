Template.ReactDashboard.onRendered(() => {
    window.RENDER_REACT('react-dashboard-root', 'home');
});

Template.ReactDashboard.onDestroyed(() => {
    window.UNRENDER_REACT('react-dashboard-root');
});

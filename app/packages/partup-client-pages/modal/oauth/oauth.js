/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_oauth.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        Intent.return('oauth', {
            fallback_route: {
                name: 'home'
            }
        });
    }
});
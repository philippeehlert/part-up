Template.Home_Footer.events({
  'click [data-help-intercom]': function(event, template) {
    event.preventDefault();

    if (Intercom) {
      Intercom('showNewMessage', 'Stel je vraag/Ask a question:');
    } else {
      console.log('Intercom not available.');
    }
  },
});

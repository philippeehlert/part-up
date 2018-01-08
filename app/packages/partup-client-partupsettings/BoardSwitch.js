Template.BoardSwitch.onRendered(function() {
  let template = this;

  if (template.data.enabled) {
    template.$('[data-board-input]').val(true);
    template.$('[data-enable] input').attr('checked', 'checked');
  } else {
    template.$('[data-board-input]').val(false);
    template.$('[data-disable] input').attr('checked', 'checked');
  }
});

Template.BoardSwitch.events({
  'click [data-enable]': function(event, template) {
    template.$('[data-board-input]').val(true);
  },
  'click [data-disable]': function(event, template) {
    template.$('[data-board-input]').val(false);
  },
});

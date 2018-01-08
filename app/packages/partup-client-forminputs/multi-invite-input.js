Template.MultiInviteInput.events({
  'keyup [data-inputrow]': function(event, template) {
    event.preventDefault();
    let inputs = template.$('input');
    let allHaveValues = true;
    _.each(inputs, function(item) {
      if (!$(item).val()) allHaveValues = false;
    });
    let last = $(event.currentTarget).data('inputrow');
    if (allHaveValues && last) {
      AutoForm.addArrayItem(template.data.formId, template.data.fieldName);
    }
  },
  'click [data-remove]': function(event, template) {
    event.preventDefault();
    let first = $(event.currentTarget).data('first');
    let last = $(event.currentTarget).data('last');
    if (last && first) {
      let inputs = template.$('input');
      _.each(inputs, function(item) {
        $(item).val(undefined);
      });
    } else {
      AutoForm.removeArrayItem(
        template.data.formId,
        template.data.fieldName,
        this.index
      );
      _.defer(function() {
        template.$('[data-null-value]').remove();
      });
    }
  },
});

Template.DatePicker.onRendered(function() {
  let template = this;
  let input = template.data.inputSettings.input;
  let options = Partup.client.datepicker.options;
  let autoFormInput =
    template.data.inputSettings.autoFormInput || 'data-autoform-input';
  options.startDate = template.data.inputSettings.startDate || undefined;

  let dateChangeHandler = function(event) {
    if (!event.date) {
      return;
    }

    let autoFormInputElement = $('[' + autoFormInput + ']');
    autoFormInputElement.val(event.date);
    autoFormInputElement.trigger('blur');

    if (template.data.collapsable) {
      const $inlineDatePicker = $('.datepicker-inline');
      if ($inlineDatePicker && $inlineDatePicker.hasClass('expanded')) {
        $inlineDatePicker.removeClass('expanded');
        $inlineDatePicker.addClass('collapsed');
        $(`[${input}]`)
          .find('.pu-input-datepicker-inline')
          .val(moment(event.date.toISOString()).format('L'));
        $('.pu-icon-calendar').show();
      }
    }
  };

  let prefillValue =
    AutoForm.getFieldValue(template.data.inputSettings.prefillValueKey) || null;

  template.end_date_datepicker = template
    .$('[' + input + ']')
    .datepicker(options)
    .datepicker('setDate', prefillValue)
    .on('changeDate clearDate', dateChangeHandler);

  // Used in activity popup form!
  if (template.data.collapsable) {
    const $inlineDatePickerTrigger = $('.pu-input-datepicker-inline');
    const $inlineDatePicker = $('.datepicker-inline');

    if ($inlineDatePicker && $inlineDatePickerTrigger) {
      if (prefillValue) {
        $(`[${input}]`)
          .find('.pu-input-datepicker-inline')
          .val(moment(prefillValue.toISOString()).format('L'));
      }

      $inlineDatePicker.addClass('collapsed');
      $inlineDatePickerTrigger.on('click', function() {
        if ($inlineDatePicker.hasClass('collapsed')) {
          $inlineDatePicker.removeClass('collapsed');
          $inlineDatePicker.addClass('expanded');
          $('.pu-icon-calendar').hide();
        } else if ($inlineDatePicker.hasClass('expanded')) {
          $inlineDatePicker.removeClass('expanded');
          $inlineDatePicker.addClass('collapsed');
          $('.pu-icon-calendar').show();
        }
      });
    }
  }
});

Template.DatePicker.onDestroyed(function() {
  let template = this;
  template.end_date_datepicker &&
    template.end_date_datepicker.datepicker('destroy');
});

Template.DatePicker.events({
  'click [data-remove-date]': function(event, template) {
    event.preventDefault();
    template.end_date_datepicker.datepicker('update', '');
    const $inlineDatePickerTrigger = $('.pu-input-datepicker-inline');
    if ($inlineDatePickerTrigger) {
      $(`[${template.data.inputSettings.input}]`)
        .find('.pu-input-datepicker-inline')
        .val('');
    }
  },
  'click .disabled': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  },
  'click tbody': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  },
  'click tr': function(event, template) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  },
});

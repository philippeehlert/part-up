Template.BasicSelector.onCreated(function() {
  let tpl = this;

  // The reactive currentOption value
  tpl.currentOption = new ReactiveVar();

  // Set default option
  tpl.autorun(function() {
    let data = Template.currentData();

    Tracker.nonreactive(function() {
      if (!tpl.currentOption.get() && data.default) {
        let default_option = lodash.find(data.options, {
          value: data.default,
        });
        if (default_option) tpl.currentOption.set(default_option);
      }
    });
  });
});

Template.BasicSelector.helpers({
  currentOption: function() {
    return Template.instance().currentOption.get();
  },
});

Template.BasicSelector.events({
  'click [data-select-option]': function(event, template) {
    event.preventDefault();
    let options = template.data.options;
    if (!options || !options.length) return;

    let value = event.currentTarget.getAttribute('data-select-option');
    let option = lodash.find(options, { value: value });
    template.currentOption.set(option);
    if (template.data.onSelect) template.data.onSelect(option);
  },
});

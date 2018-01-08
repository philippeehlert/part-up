Template.afFieldInput.onRendered(function() {
  if (this.data.focusOnRender) {
    this.find('input').focus();
  }

  if (this.data.numeric) {
    $(this.find('input')).keypress(function(e) {
      let isNumber = e.charCode >= 48 && e.charCode <= 57;
      let isSeparator = e.charCode === 44 || e.charCode === 46;
      if (!isNumber && !isSeparator) {
        e.preventDefault();
      }
    });
  }
});

Meteor.startup(function() {
  Template.autoformTags.onRendered(function() {
    let template = this;

    let inputs = template.findAll('input');

    template.hiddenInput = $(inputs[0]);
    template.visibleInput = $(inputs[1]);

    let placeholder = template.data.atts.placeholder;

    template.visibleInput.attr('placeholder', placeholder);
    template.visibleInput.attr('style', '');

    // magic to keep the input the correct width to prevent flickering
    // LORDREEKUS
    let setInputWidth = function(input) {
      let font = input.css('fontFamily');
      let fontSize = input.css('fontSize');
      let text = input.val();
      let div = $(document.createElement('div'));
      div.css({
        fontFamily: font,
        fontSize: fontSize,
        visibility: 'hidden',
        position: 'absolute',
        pointerEvents: 'none',
        width: 'auto',
        height: 'auto',
      });
      $('body').append(div);
      div.text(text);
      let width = div.width() + parseInt(fontSize);
      input.attr('style', 'width: ' + width + 'px !important;');
      input.attr('size', '');
      lodash.defer(function() {
        div.remove();
      });
    };

    template.changePlaceholder = function() {
      lodash.defer(function() {
        if (
          template.visibleInput.val() !== '' ||
          template.hiddenInput.val() !== ''
        ) {
          template.visibleInput.attr('placeholder', '');
        } else {
          template.visibleInput.attr('placeholder', placeholder);
        }
        setInputWidth(template.visibleInput);
      });
    };

    template.hiddenInput.on('change', template.changePlaceholder);
    template.visibleInput.on('input', template.changePlaceholder);
  });

  Template.autoformTags.onDestroyed(function() {
    let template = this;
    template.hiddenInput.off('change', template.changePlaceholder);
    template.visibleInput.off('input', template.changePlaceholder);
  });
});

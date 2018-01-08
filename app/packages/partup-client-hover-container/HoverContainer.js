// jscs:disable
/**
 * Render a generic hover card
 *
 * @module client-hovercontainer
 */
// jscs:enable

Template.HoverContainer.onCreated(function() {
  let template = this;
  template.settings = new ReactiveVar({});
  template.tile = new ReactiveDict();
});

Template.HoverContainer.onRendered(function() {
  let template = this;

  let showTimeout;
  let $trigger;

  var hide = function() {
    if ($trigger) $trigger.off('mouseleave', hide);

    // Unset settings and user
    template.settings.set({});
    template.tile.set('template', undefined);
    template.tile.set('data', undefined);

    clearTimeout(showTimeout);
  };

  let show = function(event) {
    $trigger = $(this);
    $card = $('[data-card]');

    // Gather data for tile
    let tileTemplate = $trigger.data('hovercontainer') || '';
    let tileData = $trigger.data('hovercontainer-context') || {};
    let delay = parseInt($trigger.data('hovercontainer-delay')) || 500;
    let orientation =
      $trigger.data('hovercontainer-orientation') || 'top-bottom';
    let typeClass = $trigger.data('hovercontainer-class') || '';
    let offset = $trigger.data('hovercontainer-offset') || '';

    // Clear any other hovercontainer timeout
    clearTimeout(showTimeout);

    // Show the card
    let delayedShow = function() {
      let OFFSET = offset || 5;
      let screenWidth = Partup.client.screen.size.get('width');
      let screenHeight = Partup.client.screen.size.get('height');
      let elOffset = $trigger.offset();
      let originX = elOffset.left - $(window).scrollLeft();
      let originY = elOffset.top - $(window).scrollTop();
      let elWidth = $trigger.outerWidth();
      let elHeight = $trigger.outerHeight();

      let set = {
        coords: {},
        leftSide: 100 / screenWidth * originX < 50,
        topHalf: 100 / screenHeight * originY > 50,
        orientation: orientation,
        typeClass: typeClass,
      };

      if (orientation === 'top-bottom') {
        set.coords.left = elWidth / 2 + originX;
        if (set.topHalf) {
          set.coords.bottom = screenHeight - originY + OFFSET;
        } else set.coords.top = originY + elHeight + OFFSET;
      }

      if (orientation === 'left-right') {
        if (set.leftSide) set.coords.left = originX + elWidth + OFFSET;
        else set.coords.right = screenWidth - originX + OFFSET;

        if (set.topHalf) {
          set.coords.bottom = screenHeight - (elHeight / 2 + originY);
        } else set.coords.top = elHeight / 2 + originY;
      }

      template.settings.set(set);
      template.tile.set('template', tileTemplate);
      template.tile.set('data', tileData);
    };

    // Show the card
    if (delay > 0) {
      showTimeout = setTimeout(delayedShow, delay);
    } else {
      delayedShow();
    }

    let onTrigger = true;
    let onCard = false;
    let initHideListener = function() {
      let hideWhenOffCardAndTrigger = function() {
        lodash.defer(function() {
          if (!onTrigger && !onCard) {
            hide();
            $card.off('mouseleave', leaveCard);
            $trigger.off('mouseleave', leaveTrigger);
            $card.off('mouseenter', enterCard);
          }
        });
      };

      var leaveCard = function() {
        onCard = false;
        hideWhenOffCardAndTrigger();
      };
      var leaveTrigger = function() {
        onTrigger = false;
        hideWhenOffCardAndTrigger();
      };
      var enterCard = function() {
        onCard = true;
      };

      $card.on('mouseleave', leaveCard);
      $trigger.on('mouseleave', leaveTrigger);
      $card.on('mouseenter', enterCard);
    };

    // Hide the card on mouse leave
    initHideListener();
  };

  $('body').on('mouseenter', '[data-hovercontainer]', show);
  Router.onBeforeAction(function() {
    hide();
    this.next();
  });
});

Template.HoverContainer.helpers({
  settings: function() {
    return Template.instance().settings.get();
  },
  tileTemplate: function() {
    return Template.instance().tile.get('template');
  },
  tileData: function() {
    return Template.instance().tile.get('data');
  },
});

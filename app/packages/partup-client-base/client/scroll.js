/**
 * Helpers for scroll behaviour
 *
 * @class scroll
 * @memberof Partup.client
 */
let INFINITE_SCROLL_OFFSET = 0;
let INFINITE_SCROLL_DEBOUNCE = 40;

Partup.client.scroll = {
  _initialized: false,
  init: function() {
    if (!window) return;
    let self = this;
    if (this._initialized) {
      return console.warn('scroll.js: cannot initialize multiple times');
    }

    this._initialized = true;

    // Debounced update function
    let d = lodash.debounce(function() {
      self.triggerUpdate.apply(self);
    }, 10);

    // Trigger a position update when the user scrolls
    window.addEventListener('scroll', d, { passive: true });
  },

  /**
   * Current scroll position reactive var
   *
   * @memberof Partup.client.scroll
   */
  pos: new ReactiveVar(0),

  /**
   * Current maxscroll
   *
   * @memberof Partup.client.scroll
   */
  maxScroll: function() {
    return document.body.scrollHeight - window.innerHeight;
  },

  /**
   * Trigger a scroll pos update
   *
   * @memberof Partup.client.scroll
   */
  triggerUpdate: function() {
    let pos =
      typeof window.scrollY !== 'undefined'
        ? window.scrollY
        : document.documentElement.scrollTop;
    Partup.client.scroll.pos.set(pos);
  },

  /**
   * Infinite scroll functionality
   *
   * @memberof Partup.client.scroll
   * @param options {Object}           Options for the infinite scroll
   * @param options.template {Blaze}   A template where the infinite scroll runs in
   * @param options.element  {Element} The container element (growing when content increases)
   * @param callback {Function}        Infinite scroll callback
   */
  infinite: function(options, callback) {
    let self = this;

    options = options || {};
    options.offset = mout.lang.isNumber(options.offset)
      ? options.offset
      : INFINITE_SCROLL_OFFSET;
    if (!options.template) return;
    if (!options.element) return;

    let trigger = function() {
      let bottomPosition = options.element.getBoundingClientRect().bottom;
      let bottomInView = bottomPosition - window.innerHeight;
      if (bottomInView < options.offset) {
        if (!options.template.view.isDestroyed) callback();
      }
    };
    let debounced_trigger = lodash.debounce(trigger, INFINITE_SCROLL_DEBOUNCE);

    self.pos.equalsFunc = function() {
      debounced_trigger();
    };
  },

  customInfinite: function(options, trigger) {
    options = options || {};
    let container = options.container;
    let template = options.template;

    let debounced_trigger = lodash.debounce(trigger, INFINITE_SCROLL_DEBOUNCE);

    let destroy = function() {
      container.removeEventListener('scroll', onScroll);
    };

    var onScroll = function(event) {
      if (template.view.isDestroyed) return destroy();
      let elem = $(event.currentTarget);
      if (
        elem[0].scrollHeight - elem.scrollTop() - options.offset <
        elem.outerHeight()
      ) {
        debounced_trigger();
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
  },

  /**
   * Check if an element is in view
   *
   * @memberof Partup.client.scroll
   * @param element  {Element}
   * @returns inView {Boolean} Whether the given element is in view
   */
  inView: function(element) {
    if (!element) return false;

    // Call the this.pos.get() function to make this function reactive
    this.pos.get();

    // Return whether the element is completely in viewport
    return (
      element.offsetTop >= 0 &&
      element.offsetTop + element.clientHeight <= window.innerHeight
    );
  },

  /**
   * Scroll to an element with optional offset
   *
   * @memberof Partup.client.scroll
   * @param element  {Element}
   * @param offset   {Number}
   * @param options  {Object}
   * @param options.duration {Number} Scroll animation duration. Defaults to zero for no animation.
   * @param options.callback {Function} Getting called when the animation ends.
   */
  to: function(element, offset, options) {
    element = element || null;
    offset = offset || 0;
    options = options || {};

    // Options
    let duration = options.duration || 0;
    let callback =
      typeof options.callback === 'function' ? options.callback : undefined;

    // Calculate position
    let position = 0;
    if (element) position += element.offsetTop || 0;
    position += offset;

    // Limit position
    position = Math.min(position, this.maxScroll());

    // Trigger scroll
    $('html, body').animate(
      {
        scrollTop: position,
      },
      duration,
      'swing',
      function() {
        if (callback) callback.apply(window);
      }
    );
  },
  scrollToAndFocusErrorField: function() {
    // wait for .invalid class to be presented in the DOM
    Meteor.setTimeout(function() {
      try {
        let $invalid = $('.pu-state-invalid:first');
        let $label = $invalid.parent().find('.pu-label');
        let $progressPager = $('.pu-progresspager');
        let $header = $('.pu-header');
        let extraOffsetTop = 10;
        let offsetTop =
          $progressPager.length && $header.length
            ? // we have to substract the height of header and progress page if
            // the elements are visible on the page
            $label.offset().top -
              extraOffsetTop -
              ($header.outerHeight() + $progressPager.outerHeight())
            : // else we have no offset
            0;
        Partup.client.scroll.to($label.get(0), offsetTop, {
          duration: 100,
        });
        $input = $invalid.find('input:visible, textarea:visible').first();
        $input.get(0).focus();
      } catch (e) {}
    }, 100); // should be enough to wait and scroll to the element
  },
  /*
     * Use this for elements with overflow: scroll where you don't
     * want any parent elements to scroll when scrollBottom or
     * scrollTop are reached
     *
     * Usage:
     * Template.app_network_chat.events({
     *     'DOMMouseScroll [data-preventscroll], mousewheel [data-preventscroll]': Partup.client.scroll.preventScrollPropagation
     * });
     *
     * NOTE: Important to use both DOMMouseScroll and mousewheel events for maximum browser coverage
     */
  preventScrollPropagation: function(event) {
    let scrollTop = event.currentTarget.scrollTop;
    let scrollHeight =
      event.currentTarget.scrollHeight - event.currentTarget.clientHeight;
    let delta =
      event.type == 'DOMMouseScroll'
        ? event.originalEvent.detail * -40
        : event.originalEvent.wheelDelta;
    let scrollingUp = delta > 0;

    if (event.currentTarget.scrollHeight > event.currentTarget.clientHeight) {
      let prevent = function() {
        event.stopPropagation();
        event.preventDefault();
        event.returnValue = false;
        return false;
      };

      if (scrollHeight === scrollTop && !scrollingUp) {
        return prevent();
      } else if (scrollTop === 0 && scrollingUp) {
        return prevent();
      }
    }
  },
};

Partup.client.scroll.triggerUpdate();

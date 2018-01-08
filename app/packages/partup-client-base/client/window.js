/**
 * Window popup helpers
 *
 * @class window
 * @memberof Partup.client
 */

Partup.client.window = {
  /**
   * Get parameters for popup window
   *
   * @memberof Partup.client.window
   * @param {Object} options
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {Boolean} options.scrollbars
   */
  getPopupWindowSettings: function(options) {
    var options = options || {};
    let width = options.width || 600;
    let height = options.height || 400;
    let scrollbars = options.scrollbars
      ? options.scrollbars ? 'yes' : 'no'
      : 'no';
    let top = window.innerHeight / 2 - height / 2;
    let left = window.innerWidth / 2 - width / 2;

    return (
      'width=' +
      width +
      ', height=' +
      height +
      ', scrollbars=' +
      scrollbars +
      ', top=' +
      top +
      ', left=' +
      left
    );
  },

  clearUrlHash: function() {
    let scrollV;
    let scrollH;
    let loc = window.location;
    if ('pushState' in history) {
      history.pushState('', document.title, loc.pathname + loc.search);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      scrollV = document.body.scrollTop;
      scrollH = document.body.scrollLeft;

      loc.hash = '';

      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scrollV;
      document.body.scrollLeft = scrollH;
    }
  },

  /**
   * Get the absolute location from the browser.
   *
   * @returns the exact location of the browser.
   */
  get location() {
    return window.location.origin
      ? window.location.origin
      : window.location.protocol +
          '//' +
          window.location.hostname +
          (window.location.port ? ':' + window.location.port : '');
  },
};

let SlideOverr;
let __bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

SlideOverr = (function() {
  SlideOverr.INSERT = {
    slideOverrIn: '0',
    slideOverrOut: '1',
  };

  SlideOverr.animations = ['slideOverrIn', 'slideOverrOut'];

  SlideOverr.prototype.animationDuration = 750;

  function SlideOverr(_at_animation, startCallback, endCallback) {
    this.animation = _at_animation;
    this.removeElement = __bind(this.removeElement, this);
    this.insertElement = __bind(this.insertElement, this);
    this.startCallback = startCallback;
    this.endCallback = endCallback;
  }

  SlideOverr.prototype.insertElement = function(node, next) {
    let start;
    start = this.constructor.INSERT[this.animation];
    if (this.startCallback) this.startCallback();
    $(node).insertBefore(next);
    return $(node).velocity(
      {
        scale: [1, start],
      },
      {
        duration: this.animationDuration,
        easing: 'ease-in-out',
        queue: false,
        complete: function() {
          if (this[0].style.cssText.indexOf('scale(1)') > -1) {
            this[0].style.cssText = '';
          }
        },
      }
    );
  };

  SlideOverr.prototype.removeElement = function(node) {
    let endCallback = this.endCallback;
    return setTimeout(
      (function(_this) {
        return function() {
          return $('.velocity-animating')
            .promise()
            .done(function() {
              if (typeof endCallback === 'function') {
                endCallback();
              }
              return $(node).remove();
            });
        };
      })(this),
      this.animationDuration
    );
  };

  return SlideOverr;
})();

this.Bender.animations.push(SlideOverr);

// ---
// generated by coffee-script 1.9.0

Template.Ring.onCreated(function() {
  let template = this;
  template.rings = new ReactiveVar([]);
  template.pages = new ReactiveVar([]);
  template.placeholder = new ReactiveVar([]);
  template.currentPage = new ReactiveVar(0);
  template.totalPages = 0;

  // helpers
  template.randomBoolean = function() {
    return !(Number(new Date()) % 2); // faux-randomness
  };

  // preset the configuration
  // to prevent recalculation in autorun
  template.getPresets = function() {
    // var startAngle = lodash.random(0, 360);
    return {
      inner: {
        radius: 30,
        startAngle: lodash.random(0, 360),
        animate: true,
      },
      outer: {
        radius: 75,
        startAngle: lodash.random(0, 360),
        animate: true,
      },
    };
  };
});

Template.Ring.onRendered(function() {
  let template = this;
  template.container = template.find('.pu-ring');
  template.mouseMoveHandler = function(e) {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let xPercent = 100 / windowWidth * e.clientX;
    let yPercent = 100 / windowHeight * e.clientY;
    $(template.container).css({
      perspectiveOrigin: xPercent + '% ' + yPercent + '%',
      perspectiveOriginX: xPercent + '%',
      perspectiveOriginY: yPercent + '%',
    });
  };

  template.debouncedMouseMoveHandler = _.throttle(
    template.mouseMoveHandler,
    100,
    true
  );
  if (!Partup.client.isMobile.isTabletOrMobile()) {
    $('.pu-swarm > header').on('mousemove', template.debouncedMouseMoveHandler);
  }

  template.createRing = function(ringElement, options) {
    // options readout
    let items = options.items || [];
    let radius = options.radius || 100;
    let startAngle =
      typeof options.startAngle === 'number'
        ? options.startAngle
        : lodash.random(0, 360);
    let skipAngle = options.skipAngle || false;
    let offset = options.offset || {};
    let offsetTop = offset.top || 0;
    let offsetLeft = offset.left || 0;
    let animate = options.animate || false;
    // randomly decide direction of circle (clockwise or counter-clockwise)
    let reverse = options.reverse || false;

    // calculation constants
    let PI = Math.PI;
    let TAU = PI * 2;
    let totalItems = items.length;

    // x-axis calculations
    let ringXDiameter = ringElement.offsetWidth;
    let ringXDiameterPercentage = 100 / ringXDiameter;
    let ringXRadius = ringXDiameter / 2;
    let ringXRadiusPercentage = ringXRadius / 100 * radius;

    // y-axis calculations
    let ringYDiameter = ringElement.offsetHeight;
    let ringYDiameterPercentage = 100 / ringYDiameter;
    let ringYRadius = ringYDiameter / 2;
    let ringYRadiusPercentage = ringYRadius / 100 * radius;

    // calculate starting angle
    let angle = TAU / 360 * startAngle;

    // calculate item angle offset
    let angleIncrement = TAU / totalItems;

    let skipChunk = function() {
      let skip = 100 / 360 * skipAngle;
      let skipTotal = Math.round(totalItems / 100 * skip);
      angleIncrement = TAU / (totalItems + skipTotal);
      for (let i = 0; i < skipTotal; i++) {
        angle += angleIncrement;
      }
    };
    let getNumberInsideRange = function(min, max, input) {
      if (input > max) input = min + (input - max);
      return input;
    };
    // skip a chunk if this is specified in options
    if (skipAngle) skipChunk();

    // loop through each item and calculate the position on ring
    items.forEach(function(item, i) {
      let x =
        ringXDiameterPercentage *
          (ringXRadiusPercentage * Math.cos(angle) + ringXRadius) +
        offsetLeft;
      let y =
        ringYDiameterPercentage *
          (ringYRadiusPercentage * Math.sin(angle) + ringYRadius) +
        offsetTop;
      if (reverse) x = 100 - x;
      let positioning = new ReactiveVar({
        x: x,
        y: y,
      });
      item.positioning = positioning;
      item.classNumber = getNumberInsideRange(
        0,
        36,
        Math.round(Math.abs(360 / TAU * angle) / 10)
      );
      angle += angleIncrement;
    });

    return items;
  };

  template.autorun(function(c) {
    let data = Template.currentData();
    if (data.rings instanceof Array) {
      c.stop();
      let pages = [];
      template.totalPages = data.rings.length;
      Tracker.nonreactive(function() {
        _.each(data.rings, function(ring, index) {
          let page = [];
          let presets = template.getPresets();
          _.each(presets, function(preset, key) {
            preset.items = ring[key] || [];
            page = page.concat(template.createRing(template.container, preset));
          });
          pages.push({
            index: index,
            rings: page,
          });
        });
        template.pages.set(pages);
      });
    } else {
      c.stop();
      let rings = [];
      Tracker.nonreactive(function() {
        let presets = template.getPresets();
        _.each(presets, function(preset, key) {
          preset.items = data.rings[key] || [];
          rings = rings.concat(template.createRing(template.container, preset));
        });
        template.rings.set(rings);
      });
    }
  });
});

Template.Ring.onDestroyed(function() {
  let template = this;
  $('.pu-swarm > header').off('mousemove', template.debouncedMouseMoveHandler);
});

Template.Ring.events({
  'click [data-right]': function(event, template) {
    event.preventDefault();
    let currentPage = template.currentPage.get();
    let totalPages = template.totalPages - 1;
    let nextPage = Math.min(currentPage + 1, totalPages);
    template.currentPage.set(nextPage);
  },
  'click [data-left]': function(event, template) {
    event.preventDefault();
    let currentPage = template.currentPage.get();
    let totalPages = template.totalPages - 1;
    let nextPage = Math.max(currentPage - 1, 0);
    template.currentPage.set(nextPage);
  },
});

Template.Ring.helpers({
  state: function() {
    let template = Template.instance();
    return {
      currentPage: function() {
        return template.currentPage.get();
      },
      firstPage: function() {
        return template.currentPage.get() === 0;
      },
      lastPage: function() {
        return template.currentPage.get() === template.totalPages - 1;
      },
      side: function() {
        return template.currentPage.get() ? 'right' : 'left';
      },
    };
  },
  data: function() {
    let template = Template.instance();
    return {
      rings: function() {
        return template.rings.get();
      },
      pages: function() {
        return template.pages.get();
      },
      placeholder: function() {
        return template.placeholder.get();
      },
    };
  },
});

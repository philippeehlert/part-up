Template.swarm_content_networks.onRendered(function() {
  let template = this;
  let mobile = window.outerWidth < 480;

  template.scrollElement = $(template.find('[data-horizontal-scroll]'));
  // remember scrolloffset;
  let oldScrollOffsetLeft = 0;
  // mousewheel handler
  template.mouseWheelHandler = function(e) {
    let scrollLeft = template.scrollElement[0].scrollLeft;
    let scrollEnd =
      template.scrollElement[0].offsetWidth + scrollLeft >
      template.scrollElement[0].scrollWidth - 800;
    let scrollDirection = oldScrollOffsetLeft < scrollLeft ? 'right' : 'left';
    oldScrollOffsetLeft = scrollLeft + 10;
    if (e.type === 'mousewheel') {
      this.scrollLeft -= e.originalEvent.wheelDeltaY;
      if (!e.originalEvent.wheelDeltaX) {
        e.preventDefault();
      }
    } else {
      e.preventDefault();
      this.scrollLeft += e.originalEvent.detail * 5;
    }
  };

  if (!mobile) {
    // template.scrollElement.on('mousewheel DOMMouseScroll', template.mouseWheelHandler);
  }
});

Template.swarm_content_networks.helpers({
  tagQuery: function() {
    return 'tag=' + this.tag;
  },
});

Template.swarm_content_networks.events({
  'click [data-right]': function(event, template) {
    let leftPos = $('[data-horizontal-scroll]').scrollLeft();
    let width = $('[data-horizontal-scroll]').width() - 50;
    $('[data-horizontal-scroll]').animate({ scrollLeft: leftPos + width }, 250);
    template.clicked.set(true);
  },
  'click [data-left]': function(event, template) {
    let leftPos = $('[data-horizontal-scroll]').scrollLeft();
    let width = $('[data-horizontal-scroll]').width() - 50;
    $('[data-horizontal-scroll]').animate({ scrollLeft: leftPos - width }, 250);
  },
});

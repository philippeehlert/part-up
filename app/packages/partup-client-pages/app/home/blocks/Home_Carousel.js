Template.Home_Carousel.onCreated(function() {
  let template = this;
  template.currentIndex = 0;
  template.totalSlides = 0;

  template.ajustCarouselHeight = function() {
    let carouselHeight = 0;

    let allSlides = template.$('[data-carousel] > [data-carousel-slide]');

    template.$('[data-carousel] > [data-carousel-slide]').each(function(index) {
      let slideHeight = $(this).height();
      if (slideHeight > carouselHeight) carouselHeight = slideHeight;
    });

    template.totalSlides = allSlides.length;

    $('[data-carousel]').height(carouselHeight);
  };

  template.gotoSlide = function(slideIndex) {
    let currentSlide = $('[data-carousel] .pu-home-carousel__slide--is-active');
    let currentImage = $('[data-carousel] .pu-home-carousel__image--is-active');
    let currentDot = $(
      '[data-carousel] .pu-home-carousel__navigation__dot--is-active'
    );

    currentSlide.removeClass('pu-home-carousel__slide--is-active');
    currentImage.removeClass('pu-home-carousel__image--is-active');
    currentDot.removeClass('pu-home-carousel__navigation__dot--is-active');

    let allSlides = template.$('[data-carousel] > [data-carousel-slide]');

    template.totalSlides = allSlides.length;

    allSlides.each(function(index) {
      if (index < slideIndex) {
        $(this).removeClass('pu-home-carousel__slide--right');
        $(this).addClass('pu-home-carousel__slide--left');
      } else if (index > slideIndex) {
        $(this).removeClass('pu-home-carousel__slide--left');
        $(this).addClass('pu-home-carousel__slide--right');
      } else {
        $(this).removeClass('pu-home-carousel__slide--left');
        $(this).removeClass('pu-home-carousel__slide--right');
        $(this).addClass('pu-home-carousel__slide--is-active');
      }
    });

    $(
      template.$('[data-carousel] > [data-carousel-slide-image]')[slideIndex]
    ).addClass('pu-home-carousel__image--is-active');
    $(
      template.$('[data-carousel-navigation] > [data-carousel-dot]')[slideIndex]
    ).addClass('pu-home-carousel__navigation__dot--is-active');

    template.currentIndex = slideIndex;
  };
});

Template.Home_Carousel.onRendered(function() {
  let template = this;
  template.ajustCarouselHeight();
  $(window).on('resize', template.ajustCarouselHeight);

  template.interval = setInterval(function() {
    if (template.pauseInterval) return;
    let gotoSlide =
      template.currentIndex === template.totalSlides - 1
        ? 0
        : template.currentIndex + 1;

    template.gotoSlide(gotoSlide);
  }, 5000);
});

Template.Home_Carousel.onDestroyed(function() {
  let template = this;
  $(window).off('resize', template.ajustCarouselHeight);

  clearInterval(template.interval);
});

Template.Home_Carousel.events({
  'click [data-carousel-dot]': function(event, template) {
    event.preventDefault();
    let slideIndex = parseInt($(event.currentTarget).data('carousel-dot'));
    template.gotoSlide(slideIndex);
  },
  'click [data-carousel-arrow-left]': function(event, template) {
    event.preventDefault();
    let gotoSlide =
      template.currentIndex === 0
        ? template.totalSlides - 1
        : template.currentIndex - 1;
    template.gotoSlide(gotoSlide);
  },
  'click [data-carousel-arrow-right]': function(event, template) {
    event.preventDefault();
    let gotoSlide =
      template.currentIndex === template.totalSlides - 1
        ? 0
        : template.currentIndex + 1;
    template.gotoSlide(gotoSlide);
  },
  'mouseenter [data-carousel]': function(event, template) {
    template.pauseInterval = true;
  },
  'mouseleave [data-carousel]': function(event, template) {
    template.pauseInterval = false;
  },
});

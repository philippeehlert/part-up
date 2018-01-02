Template.app_partup_carousel.onCreated(function() {

    const partupId = this.data.partupId;
    const partup = Partups.findOne(partupId);
    let images = [];

    if (partup) {
        images = [{type: 'image', id: partup.image}, ...partup.highlighted];
    }

    this.images = images;
});

Template.app_partup_carousel.onRendered(function() {
    const template = this;

    if (this.images.length) {
        // wait a frame because we need the focus point to be set on the first item.
        setTimeout(() => {
            $('.pu-carousel').slick({
                dots: true,
                arrows: true,
                prevArrow: '<button type="button" class="pu-carousel-prev"><i class="picon-caret-slim-left"></i></button>',
                nextArrow: '<button type="button" class="pu-carousel-next"><i class="picon-caret-slim-right"></i></button>',
                autoplay: true,
                autoplaySpeed: 10000,
                onBeforeChange: (carousel, currentIndex) => {
                    const current = template.images[currentIndex];
                    if (current && current.type === 'video') {
                        template.$(`[data-video="${currentIndex}"]`).each((index, video) => {
                            video.src = video.src;
                        });
                    }
                }
            });
        }, 0);
    }
});

Template.app_partup_carousel.helpers({
    typeIsVideo: (type) => type === 'video',
    isYoutubeVideo: (videoType) => videoType === 'youtube',
    images: () => Template.instance().images || [],
    firstIndex: (index) => index === 0,
});

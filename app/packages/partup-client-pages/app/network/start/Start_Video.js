Template.Start_Video.helpers({
    data(...args) {
        const { networkSlug: slug } = this;
        const {
            name: tribename,
            content: {
                video_url,
                why_title,
                why_body
            } = {},
        } = Networks.findOne({slug});
        return {
            video_url: () => video_url || TAPi18n.__('pages-app-network-landing-intro-video-fallback'),
            video_placeholder: function() {
                return TAPi18n.__('pages-app-home-intro-video-placeholder');
            },
            why_title: () => why_title || TAPi18n.__('pages-app-network-landing-intro-why-title-fallback', {tribename}),
            why_body: () => why_body || TAPi18n.__('pages-app-network-landing-intro-why-body-fallback', {tribename}),
        };
    }
});

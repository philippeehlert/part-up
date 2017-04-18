Template.Start_About.helpers({
    data(...args) {
        const { networkSlug: slug } = this;
        const {
            name: tribename,
            content: {
                about_title,
                about_body
            } = {},
            website,
            facebook_url,
            twitter_url,
            linkedin_url,
            instagram_url,
        } = Networks.findOne({slug});
        return {
            about_title: () => about_title || TAPi18n.__('pages-app-network-landing-about-title-fallback', {tribename}),
            about_body: () => about_body || TAPi18n.__('pages-app-network-landing-about-body-fallback', {tribename}),
            links: () => ({
                isEmpty: !(
                    website ||
                    facebook_url ||
                    twitter_url ||
                    linkedin_url ||
                    instagram_url
                ),
                website,
                facebook_url,
                twitter_url,
                linkedin_url,
                instagram_url,
            }),
        };
    }
});

Template.Start_About.helpers({
    data(...args) {
        const { networkSlug: slug } = this;
        const {
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
            about_title: () => about_title,
            about_body: () => about_body,
            links: () => ({
                website,
                facebook_url,
                twitter_url,
                linkedin_url,
                instagram_url,
            }),
        };
    }
});

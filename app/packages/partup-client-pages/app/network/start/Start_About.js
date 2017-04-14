Template.Start_About.helpers({
    data(...args) {
        const { networkSlug: slug } = this;
        const { content: {about_title, about_body} = {} } = Networks.findOne({slug});
        return {
            about_title: () => about_title,
            about_body: () => about_body,
        };
    }
});

Template.Start_Video.helpers({
    data(...args) {
        const { networkSlug: slug } = this;
        const { content: {video_url, why_title, why_body} = {} } = Networks.findOne({slug});
        return {
            video_url: () => video_url,
            why_title: () => why_title,
            why_body: () => why_body,
        };
    }
});

// import sanitizeHTML from 'sanitize-html';

// const allowedHTMLTags = [
//     'p',
//     'a',
//     'img',
//     'span',
//     'svg',
// ];

Template.dangerouslyRenderHTML.onCreated(function() {
    const { transform = html => html } = this.data;
    this.transform = transform;
    this.access = this.data.access;
});

/**
 * Sanitize and set HTML dangerously
 *
 * {{> dangerouslyRenderHTML HTML=htmlString transform=transformFunction }}
 */
Template.dangerouslyRenderHTML.helpers({
    render() {
        const template = Template.instance();
        const transform = template.transform;
        const transformed = transform(template.data.HTML);
        const sanitizeAccess = template.access || 'standard';

        return Partup.client.html.sanitize(transformed, sanitizeAccess);
    },
});

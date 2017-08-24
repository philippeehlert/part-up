import sanitizeHTML from 'sanitize-html';

const allowedHTMLTags = [
    'p',
    'a',
    'img',
    'span',
    'svg',
];

Template.dangerouslyRenderHTML.onCreated(function() {
    const {transform = (html) => html} = this.data;
    this.transform = transform;
});

/**
 * sanitizes and sets html dangerously
 *
 * {{> dangerouslyRenderHTML HTML=htmlString transform=transformFunction }}
 */
Template.dangerouslyRenderHTML.helpers({
    render: function() {
        const template = Template.instance();
        const transform = template.transform;
        const transformed = transform(template.data.HTML);

        return sanitizeHTML(transformed, {
            allowedTags: allowedHTMLTags,
            allowedAttributes: {
                a: ['href', 'name', 'target'],
                img: ['src'],
                '*': ['class'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
        });
    },
});

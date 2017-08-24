import sanitizeHTML from 'sanitize-html';

const allowedHTMLTags = [
    'p',
    'a',
    'img',
    'span',
];

Template.dangerouslyRenderHTML.helpers({
    render: function() {
        const template = Template.instance();

        return sanitizeHTML(template.data.HTML, {
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

import sanitizeHTML from 'sanitize-html';

const allowedHTMLTags = [
    'p',
    'a',
    'img',
    'span',
    'svg',
];

/**
 * sanitizes and sets html dangerously
 *
 * {{> dangerouslyRenderHTML HTML=htmlString transform=transformHelper }}
 */
Template.dangerouslyRenderHTML.helpers({
    render: function() {
        const template = Template.instance();
        const transform = template.data.transform ? template.data.transform : (html) => html;
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

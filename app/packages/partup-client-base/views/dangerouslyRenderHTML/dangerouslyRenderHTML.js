import sanitizeHTML from 'sanitize-html';

Template.dangerouslyRenderHTML.helpers({
    render: function() {
        var template = Template.instance();

        return sanitizeHTML(template.data.HTML, {
            allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span'],
            allowedAttributes: {
                a: ['href', 'name', 'target'],
                img: ['src'],
                '*': ['class'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
        });
    },
});

import _ from 'lodash';
import sanitizeHTML from 'sanitize-html';
import sanitizeConfig from './_sanitizeConfig';

Partup.client.html = {
    SANITIZE_ACCESS: {
        STANDARD: 'STANDARD',
        LINKS: 'LINKS',
        MARKUP: 'MARKUP',
    },

    sanitize(html, sanitizeAccess) {
        if (!html && typeof html !== 'string') {
            throw new Error('html.sanitize: html input is not valid');
        }
        const config = sanitizeConfig[_.toLower(sanitizeAccess)];
        if (!config) {
            throw new Error(`html.sanitize: Could not find a sanitize configuration for '${sanitizeAccess}'`);
        }

        return sanitizeHTML(html, {
            allowedTags: config.tags,
            allowedAttributes: {
                ...config.attributes,
                '*': ['class'],
            },
            allowedSchemas: ['http', 'https', 'mailto'],
        });
    },
};

import _ from 'lodash';

/**
 * Sanitize configuration
 */
const sanitizeMap = {
    tags: {
        a: {
            default: [
                'href',
                'name',
                'target',
                'data-*',
            ],
            standard: [
                'href',
            ],
        },
        img: {
            default: [
                'src',
            ],
        },
    },
    access: {
        standard: [
            'a',
        ],
        links: [
            'a',
        ],
        markup: [
            'a',
            'p',
            'blockquote',
            'span',
            'img',
            'ul',
            'ol',
            'li',
            'b',
            'i',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
        ],
    },
};


// Create the config from the map.
const sanitizeConfig = {};

_.each(Object.keys(sanitizeMap.access), (accessLevel) => {
    const configTags = sanitizeMap.access[accessLevel];
    const configAttributes = _.reduce(configTags, (result, tag) => {
        const tagConfig = sanitizeMap.tags[tag];
        const newResult = Object.assign({}, result);

        if (tagConfig) {
            if (tagConfig[accessLevel]) {
                newResult[tag] = tagConfig[accessLevel];
            } else if (tagConfig.default) {
                newResult[tag] = tagConfig.default;
            }
        }
        return newResult;
    }, {});

    sanitizeConfig[accessLevel] = {
        tags: configTags,
        attributes: configAttributes,
    };
});

Object.freeze(sanitizeConfig);
export default sanitizeConfig;

import { get } from 'lodash';
import Meteor from 'utils/Meteor';
const dev = process.env.REACT_APP_DEV;

export function find(...args) {
    return Meteor.collection('cfs.images.filerecord').find(...args);
};

export function findOne(...args) {
    return Meteor.collection('cfs.images.filerecord').findOne(...args);
};

export function getUrl(image, store) {
    store = store || '1200x520';
    const imageKey = get(image, 'copies[' + store + '].key');
    if (!imageKey) return undefined;

    if (dev) {
        // staging acceptance production aws image url
        return ['https://s3-eu-west-1.amazonaws.com/partup-production/',
            store,
            '/',
            imageKey,
        ].join('');
    }

    // staging acceptance production aws image url
    return ['https://s3-',
        get(window, 'Meteor.settings.public.aws.region'),
        '.amazonaws.com/',
        get(window, 'Meteor.settings.public.aws.bucket'),
        '/',
        store,
        '/',
        imageKey,
    ].join('');
};
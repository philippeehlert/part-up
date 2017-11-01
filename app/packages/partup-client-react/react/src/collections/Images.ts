import { get } from 'lodash';
import Meteor from 'utils/Meteor';

interface Image {
    _id: string;
}

export function find(...args: any[]) {
    return Meteor.collection('cfs.images.filerecord').find(...args) as Array<Image>;
}

export function findOne(...args: any[]) {
    return Meteor.collection('cfs.images.filerecord').findOne(...args) as Image;
}

export function getUrl(image: Image, store: string = '360x360'): string {
    const imageKey = get(image, `copies[${store}].key`);

    if (!imageKey) return '';

    const region = get(window, 'Meteor.settings.public.aws.region', 'eu-west-1');
    const bucket = get(window, 'Meteor.settings.public.aws.bucket', 'partup-production');

    // staging acceptance production aws image url
    return `https://s3-${region}.amazonaws.com/${bucket}/${store}/${imageKey}`;
}

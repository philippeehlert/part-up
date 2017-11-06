import { get } from 'lodash';
import Meteor from 'utils/Meteor';

interface Image {
    _id: string;
}

const statics: Array<Image> = [];

export function updateStatic(staticImages: Array<Image>) {
    staticImages.forEach((image) => {
        const index = statics.findIndex((element) => {
            return element._id === image._id;
        });

        if (index > -1) {
            statics[index] = image;
        } else {
            statics.push(image);
        }
    });
}

export function find(...args: any[]) {
    return Meteor.collection('cfs.images.filerecord').find(...args) as Array<Image>;
}

export function findOne(...args: any[]) {
    return Meteor.collection('cfs.images.filerecord').findOne(...args) as Image;
}

export function findStatic() {
    return statics as Array<Image>;
}

export function findOneStatic(imageId: string) {
    return statics.find((element) => element._id === imageId) as Image;
}

export function getUrl(image: Image, store: string = '360x360'): string {
    const imageKey = get(image, `copies[${store}].key`);

    if (!imageKey) return '';

    const region = get(window, 'Meteor.settings.public.aws.region', 'eu-west-1');
    const bucket = get(window, 'Meteor.settings.public.aws.bucket', 'partup-production');

    // staging acceptance production aws image url
    return `https://s3-${region}.amazonaws.com/${bucket}/${store}/${imageKey}`;
}

export default {
    updateStatic,
    find,
    findOne,
    findStatic,
    findOneStatic,
    getUrl,
};

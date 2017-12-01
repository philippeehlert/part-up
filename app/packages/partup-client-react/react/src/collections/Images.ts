import { get } from 'lodash';
import { Collection, CollectionDocument } from 'collections/Collection';

interface Image extends CollectionDocument {
    store: string;
}

class ImagesCollection extends Collection<Image> {

    public getUrl = (image?: Image, store: string = '360x360'): string => {
        const imageKey = get(image, `copies[${store}].key`);

        if (!imageKey) return '';

        const region = get(window, 'Meteor.settings.public.aws.region', 'eu-west-1');
        const bucket = get(window, 'Meteor.settings.public.aws.bucket', 'partup-production');

        // staging acceptance production aws image url
        return `https://s3-${region}.amazonaws.com/${bucket}/${store}/${imageKey}`;
    }

}

export const Images = new ImagesCollection({
    collection: 'cfs.images.filerecord',
});

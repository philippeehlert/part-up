import { get } from 'lodash';

import { CollectionDocument, Collection } from 'collections/Collection';

export interface PartupDocument extends CollectionDocument {
    store: string;
    name: string;
}

class PartupsCollection extends Collection<PartupDocument> {

    public getSlugById = (partupId: string) => {
        const partup = this.findOne({ _id: partupId });
        const staticPartup = this.findOneStatic({ _id: partupId });

        return get(partup, 'slug', get(staticPartup, 'slug')) as string;
    }

    public hasUpper = (partupId: string, userId: string) => {
        const partup = this.findOne({ _id: partupId });
        const staticPartup = this.findOneStatic({ _id: partupId });

        return !!(get(partup, 'uppers', get(staticPartup, 'uppers')) || []).includes(userId) as boolean;
    }

}

export const Partups = new PartupsCollection({
    collection: 'partups',
});

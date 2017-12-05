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

}

export const Partups = new PartupsCollection({
    collection: 'partups',
});

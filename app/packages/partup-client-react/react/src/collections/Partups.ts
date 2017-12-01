import { get } from 'lodash';

import { CollectionDocument, Collection } from 'collections/Collection';

interface Partup extends CollectionDocument {
    store: string;
}

class PartupsCollection extends Collection<Partup> {

    public getSlugById = (partupId: string) => {
        const partup = this.findOne({ _id: partupId });
        const staticPartup = this.findOneStatic(partupId);

        return get(partup, 'slug', get(staticPartup, 'slug')) as string;
    }

}

export const Partups = new PartupsCollection({
    collection: 'partups',
});

import { Collection, CollectionDocument } from 'collections/Collection';

export interface Lane extends CollectionDocument {
    _id: string;
}

class LanesCollection extends Collection<Lane> {

}

export const Lanes = new LanesCollection({
    collection: 'lanes',
});

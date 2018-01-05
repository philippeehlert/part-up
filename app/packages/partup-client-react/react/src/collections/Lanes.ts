import { Collection, CollectionDocument } from 'collections/Collection';

export interface LaneDocument extends CollectionDocument {
    _id: string;
}

class LanesCollection extends Collection<LaneDocument> {

}

export const Lanes = new LanesCollection({
    collection: 'lanes',
});

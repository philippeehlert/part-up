import { Collection, CollectionDocument } from 'collections/Collection';

export interface Contribution extends CollectionDocument {
    upper_id: string;
    activity_id: string;
}

class ContributionsCollection extends Collection<Contribution> {

}

export const Contributions = new ContributionsCollection({
    collection: 'contributions',
});

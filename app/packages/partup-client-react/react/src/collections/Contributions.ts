import { Collection, CollectionDocument } from 'collections/Collection';

export interface ContributionDocument extends CollectionDocument {
    upper_id: string;
    activity_id: string;
}

class ContributionsCollection extends Collection<ContributionDocument> {

}

export const Contributions = new ContributionsCollection({
    collection: 'contributions',
});

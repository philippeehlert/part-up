import { Collection, CollectionDocument } from 'collections/Collection';

export interface ActivityDocument extends CollectionDocument {
    _id: string;
    description: string;
    end_date: Date;
    name: string;
    partup_id: string;
    update_id: string;
    archived: boolean;
}

class ActivitiesCollection extends Collection<ActivityDocument> {

}

export const Activities = new ActivitiesCollection({
    collection: 'activities',
});

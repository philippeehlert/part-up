import { Collection, CollectionDocument } from 'collections/Collection';

export interface Activity extends CollectionDocument {
    _id: string;
    end_date: Date;
}

class ActivitiesCollection extends Collection<Activity> {

}

export const Activities = new ActivitiesCollection({
    collection: 'activities',
});

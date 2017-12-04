import { Collection, CollectionDocument } from 'collections/Collection';

export interface Activity extends CollectionDocument {
    _id: string;
    end_date: Date;
    name: string;
    partup_id: string;
    update_id: string;
}

class ActivitiesCollection extends Collection<Activity> {

}

export const Activities = new ActivitiesCollection({
    collection: 'activities',
});

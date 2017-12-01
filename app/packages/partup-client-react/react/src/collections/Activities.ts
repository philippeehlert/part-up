import { Collection } from 'collections/Collection';

interface Activity {
    _id: string;
}

class ActivitiesCollection extends Collection<Activity> {

}

export const Activities = new ActivitiesCollection({
    collection: 'activities',
});

import { Collection, CollectionDocument } from 'collections/Collection';
import { Profile } from 'types/User';

export interface User extends CollectionDocument {
    profile: Profile;
    upperOf: Array<string>;
    supporterOf: Array<string>;
}

class UsersCollection extends Collection<User> {

}

export const Users = new UsersCollection({
    collection: 'users',
});

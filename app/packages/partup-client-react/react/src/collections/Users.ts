import { Collection, CollectionDocument } from 'collections/Collection';
import { Profile } from 'types/User';

export interface UserDocument extends CollectionDocument {
    profile: Profile;
    upperOf: Array<string>;
    supporterOf: Array<string>;
}

class UsersCollection extends Collection<UserDocument> {

}

export const Users = new UsersCollection({
    collection: 'users',
});

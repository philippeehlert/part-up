import { Collection, CollectionDocument } from 'collections/Collection';
import { Profile } from 'typedefinitions/User';
import { Meteor } from 'utils/Meteor';

export interface UserDocument extends CollectionDocument {
    profile: Profile;
    upperOf: Array<string>;
    supporterOf: Array<string>;
}

class UsersCollection extends Collection<UserDocument> {

    public findLoggedInUser = (): UserDocument | undefined => {
        return Meteor.user() as UserDocument | undefined;
    }

}

export const Users = new UsersCollection({
    collection: 'users',
});

import { Collection, CollectionDocument } from 'collections/Collection';
import { Profile } from 'typedefinitions/User';
import { Meteor } from 'utils/Meteor';
import { PartupDocument } from 'collections/Partups';

export interface UserDocument extends CollectionDocument {
    profile: Profile;
    upperOf: Array<string>;
    supporterOf: Array<string>;
}

class UsersCollection extends Collection<UserDocument> {

    public findLoggedInUser = (): UserDocument | undefined => {
        return Meteor.user() as UserDocument | undefined;
    }

    public isSuporterOfUpperOfPartup(user: UserDocument, partup: PartupDocument) {
        const partupIds = [ ...user.supporterOf, ...user.upperOf ];

        if (partupIds.includes(partup._id)) {
            return true;
        }

        return false;
    }

    public isPendingPartnerOfPartup(user: UserDocument, partup: PartupDocument) {
        return !!(partup.pending_partners || []).find(id => id === user._id);
    }

}

export const Users = new UsersCollection({
    collection: 'users',
});

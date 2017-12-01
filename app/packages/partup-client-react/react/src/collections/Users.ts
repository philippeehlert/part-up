import { Collection } from 'collections/Collection';

import { User } from 'types/User';

class UsersCollection extends Collection<User> {

}

export const Users = new UsersCollection({
    collection: 'users',
});

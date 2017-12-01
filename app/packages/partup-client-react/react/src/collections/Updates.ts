import { User } from 'types/User';
import { Collection } from 'collections/Collection';
import { Partups } from 'collections/Partups';
import { Users } from 'collections/Users';

export interface UpperUser {
    chats: Array<string>,
    completeness: number,
    networks: Array<string>,
    participation_score: number,
    status: {online: boolean},
    supporterOf: Array<string>,
    upperOf: Array<string>,
}

export interface Comment {
    _id: string,
    content: string,
    created_at: Date,
    creator: {_id: string, name: string, image: string}
    type: string,
    updated_at: Date,
}

export interface Update {
    _id: string,
    upper_id: string|null,
    partup_id: string|null,
    type: string,
    type_data: {
        [type: string]: any,
    },
    comments?: Array<Comment>
    comments_count?: number,
    created_at: Date,
    updated_at: Date,
    upper_data: Array<any>,
    createdBy?: User & UpperUser|any,
    partup: any,
}

const getUpdateCreator = (update: Update) => {
    if (update.upper_id) {
        return Users.findOne({ _id: update.upper_id });
    }

    if (update.partup_id) {
        return Partups.findOne({ _id: update.partup_id });
    }

    return null;
}

class UpdatesCollection extends Collection<Update> {

    public getUpdatesForLoggedInUser = (): Update[] => {
        const updates = this.find();

        return updates.map((update: Update) => {
            return {
                ...update,
                partup: Partups.findOne({ _id: update.partup_id }),
                createdBy: getUpdateCreator(update),
            };
        });
    }
}

export const Updates = new UpdatesCollection({
    collection: 'updates',
});

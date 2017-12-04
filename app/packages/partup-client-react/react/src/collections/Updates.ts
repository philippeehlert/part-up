import { Collection, CollectionDocument } from 'collections/Collection';
import { Partups } from 'collections/Partups';
import { Users, UserDocument } from 'collections/Users';
import { ActivityDocument } from 'collections/Activities';

export interface UpdateUpperUserSubDocument {
    chats: Array<string>;
    completeness: number;
    networks: Array<string>;
    participation_score: number;
    status: {online: boolean};
    supporterOf: Array<string>;
    upperOf: Array<string>;
}

export interface UpdateCommentSubDocument {
    _id: string;
    content: string;
    created_at: Date;
    creator: {
        _id: string;
        name: string;
        image: string;
    };
    type: string;
    updated_at: Date;
}

export interface UpdateDocument extends CollectionDocument {
    upper_id: string;
    partup_id: string;
    type: string;
    type_data: {
        [type: string]: any;
    };
    comments?: Array<UpdateCommentSubDocument>
    comments_count?: number;
    created_at: Date;
    updated_at: Date;
    upper_data: Array<any>;
    createdBy?: UserDocument & UpdateUpperUserSubDocument|any;
    system: boolean;
}

export interface ConversationUpdateDocument extends UpdateDocument {
    upper: UserDocument;
    activity: ActivityDocument;
}

const getUpdateCreator = (update: UpdateDocument) => {
    if (update.upper_id) {
        return Users.findOne({ _id: update.upper_id });
    }

    if (update.partup_id) {
        return Partups.findOne({ _id: update.partup_id });
    }

    return null;
};

class UpdatesCollection extends Collection<UpdateDocument> {

    public getUpdatesForLoggedInUser = (): UpdateDocument[] => {
        const updates = this.find();

        return updates.map((update: UpdateDocument) => {
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

// import { get } from 'lodash';
import { Meteor } from 'utils/Meteor'

import { User } from 'types/User';

export type UpperUser = {
    chats: Array<string>,
    completeness: number,
    networks: Array<string>,
    participation_score: number,
    status: {online: boolean},
    supporterOf: Array<string>,
    upperOf: Array<string>,
};

export type Comment = {
    _id: string,
    content: string,
    created_at: Date,
    creator: {_id: string, name: string, image: string}
    type: string,
    updated_at: Date,
};

export type Update = {
    _id: string,
    upper_id: string|null,
    partup_id: string|null,
    type: string,
    type_data: {
        [type: string]: any,
    },
    comments?: Array<Comment>
    comments_count: number,
    created_at: Date,
    updated_at: Date,
    upper_data: Array<any>,
    createdBy?: User & UpperUser|any,
    partup: any,
};

export function getUpdatesForLoggedInUser(): Array<Update> {
    const updates = Meteor.collection('updates').find() as Array<Update>;

    return updates.map((update) => {

        return {
            ...update,
            partup: Meteor.collection('partups').findOne({_id: update.partup_id}),
            createdBy: getUpdateCreator(update),
        };
    });
}

function getUpdateCreator(update: Update) {
    if (update.upper_id) {
        return Meteor.collection('users').findOne({_id: update.upper_id});
    }

    if (update.partup_id) {
        return Meteor.collection('partups').findOne({_id: update.partup_id});
    }

    return null;
}

export default {
    getUpdatesForLoggedInUser,
};

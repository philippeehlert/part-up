import { get } from 'lodash';
import { Meteor } from 'utils/Meteor';

interface Partup {
    _id: string;
}

const statics: Array<Partup> = [];

export function updateStatic(staticPartups: Array<Partup>) {
    staticPartups.forEach((partup) => {
        const index = statics.findIndex((element) => {
            return element._id === partup._id;
        });

        if (index > -1) {
            statics[index] = partup;
        } else {
            statics.push(partup);
        }
    });
}

export function find(...args: any[]) {
    return Meteor.collection('partups').find(...args);
}

export function findOne(...args: any[]) {
    return Meteor.collection('partups').findOne(...args);
}

export function findStatic() {
    return statics as Array<Partup>;
}

export function findOneStatic(partupId: string) {
    return statics.find((element) => element._id === partupId) as Partup;
}

export function getSlug(partupId: string) {
    const partup = findOne({ _id: partupId });
    const staticPartup = findOneStatic(partupId);

    return get(partup, 'slug', get(staticPartup, 'slug'));
}

export const Partups = {
    updateStatic,
    find,
    findOne,
    findStatic,
    findOneStatic,
    getSlug,
};

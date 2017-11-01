// import { get } from 'lodash';
import Meteor from 'utils/Meteor';

export function find(...args: any[]) {
    return Meteor.collection('partups').find(...args);
}

export function findOne(...args: any[]) {
    return Meteor.collection('partups').findOne(...args);
}

export default {
    find,
    findOne,
};

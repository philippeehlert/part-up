import { Meteor } from 'utils/Meteor';
import { uniqBy } from 'lodash';

export interface CollectionProps {
    collection: string;
}

export interface CollectionDocument {
    _id: string;
}

export class Collection<Document extends CollectionDocument> {

    private collection: string = '';
    private statics: Document[] = [];

    constructor({ collection }: CollectionProps) {
        this.collection = collection;
    }

    public find = (...args: any[]): Document[] => {
        return Meteor.collection(this.collection).find(...args) as Document[];
    }

    public findOne = (...args: any[]): Document | undefined => {
        return this.find(...args).pop() as Document;
    }

    public findStatic = (): Document[] => {
        return this.statics as Document[];
    }

    public findOneStatic = (documentId: string): Document | undefined => {
        return this.statics.find((document) => document._id === documentId) as Document;
    }

    public updateStatics = (newStatics: Document[]): void => {
        this.statics = uniqBy([
            ...this.statics,
            ...newStatics,
        ], '_id');
    }
}

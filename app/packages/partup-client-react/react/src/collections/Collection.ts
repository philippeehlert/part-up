import { Meteor, MeteorCollection } from 'utils/Meteor';
import { uniqBy, find, filter, matches } from 'lodash';

export interface CollectionProps {
    collection: string;
}

export type CollectionDocumentId = string;

export interface CollectionDocument {
    _id: CollectionDocumentId;
}

interface MergedDocument<CD> {
    __document: CD;
    __staticDocument: CD;
}

export abstract class Collection<CD extends CollectionDocument> {

    private collection: MeteorCollection;
    private statics: CD[] = [];

    constructor({ collection }: CollectionProps) {
        this.collection = Meteor.collection(collection);
    }

    public find = (selector: Object = {}, options: Object = {}): CD[] => {
        return this.collection.find(selector, options) as CD[];
    }

    public findOne = (selector: Object = {}, options: Object = {}): CD | undefined => {
        return (this.find(selector, options) || []).pop() as CD | undefined;
    }

    // uses _.matches so it can only be used with a selector
    public findStatic = (selector?: Object): CD[] => {
        if (!selector) return this.statics;

        return filter(this.statics, matches(selector)) as CD[];
    }

    // uses _.matches so it can only be used with a selector
    public findOneStatic = (selector: Object = {}): CD | undefined => {
        return find(this.statics, matches(selector)) as CD | undefined;
    }

    public findOneAny = (selector: Object = {}, options: Object = {}, preferStatic: Boolean = false):
        CD & MergedDocument<CD> | undefined => {

        const document = this.findOne(selector, options);
        const staticDocument = this.findOneStatic(selector);

        if (!document && !staticDocument) return undefined;

        // preferStatic flag switches document with staticDocument for Object.assign order
        if (preferStatic) {
            return {
                ...(document || {}),
                ...(staticDocument || {}),
                __document: document,
                __staticDocument: staticDocument,
            } as CD & MergedDocument<CD>;
        }

        return {
            ...(staticDocument || {}),
            ...(document || {}),
            __document: document,
            __staticDocument: staticDocument,
        } as CD & MergedDocument<CD>;
    }

    public updateStatics = (newStatics: CD[]): void => {
        this.statics = uniqBy([
            ...this.statics,
            ...newStatics,
        ], '_id');
    }
}

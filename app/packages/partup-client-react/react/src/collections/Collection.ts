import { Meteor, MeteorCollection } from 'utils/Meteor';
import { uniqBy, find, filter, matches } from 'lodash';

export interface CollectionProps {
    collection: string;
}

export interface CollectionDocument {
    _id: string;
}

interface MergedDocument {
    __document: any;
    __staticDocument: any;
}

export abstract class Collection<Document extends CollectionDocument> {

    private collection: MeteorCollection;
    private statics: Document[] = [];

    constructor({ collection }: CollectionProps) {
        this.collection = Meteor.collection(collection);
    }

    public find = (selector: Object = {}, options: Object = {}): Document[] => {
        return this.collection.find(selector, options) as Document[];
    }

    public findOne = (selector: Object = {}, options: Object = {}): Document | undefined => {
        return this.find(selector, options).pop() as Document | undefined;
    }

    // uses _.matches so it can only be used with a selector
    public findStatic = (selector: Object = {}): Document[] => {
        return filter(this.statics, matches(selector)) as Document[];
    }

    // uses _.matches so it can only be used with a selector
    public findOneStatic = (selector: Object = {}): Document | undefined => {
        return find(this.statics, matches(selector)) as Document | undefined;
    }

    public findOneAny = (selector: Object = {}, options: Object = {}): (Document & MergedDocument) | undefined => {
        const document = this.findOne(selector, options) || {};
        const staticDocument = this.findOneStatic(selector) || {};

        if (!document && !staticDocument) return undefined;

        return {
            ...staticDocument,
            ...document,
            __document: document,
            __staticDocument: staticDocument,
        } as Document & MergedDocument;
    }

    public updateStatics = (newStatics: Document[]): void => {
        this.statics = uniqBy([
            ...this.statics,
            ...newStatics,
        ], '_id');
    }
}

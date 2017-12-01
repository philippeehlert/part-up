import { Meteor, MeteorCollection } from 'utils/Meteor';
import { uniqBy } from 'lodash';

export interface CollectionProps {
    collection: string;
}

export interface CollectionDocument {
    _id: string;
}

export abstract class Collection<Document extends CollectionDocument> {

    private collection: MeteorCollection;
    private statics: Document[] = [];

    constructor({ collection }: CollectionProps) {
        this.collection = Meteor.collection(collection);
    }

    /**
     * @param  {any[]} ...args
     * @returns Document[]
     */
    public find = (selector: Object = {}, options: Object = {}): Document[] => {
        return this.collection.find(selector, options) as Document[];
    }

    /**
     * @param  {any[]} ...args
     * @returns Document
     */
    public findOne = (selector: Object = {}, options: Object = {}): Document | undefined => {
        return this.find(selector, options).pop() as Document | undefined;
    }

    /**
     * @returns Document[]
     */
    public findStatic = (): Document[] => {
        return this.statics as Document[];
    }

    /**
     * @param  {string} documentId
     * @returns Document
     */
    public findOneStatic = (documentId: string): Document | undefined => {
        return this.statics.find((document) => document._id === documentId) as Document | undefined;
    }

    /**
     * @param  {Document[]} newStatics
     * @returns void
     */
    public updateStatics = (newStatics: Document[]): void => {
        this.statics = uniqBy([
            ...this.statics,
            ...newStatics,
        ], '_id');
    }
}

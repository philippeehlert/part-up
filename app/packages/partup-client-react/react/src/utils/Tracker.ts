import { CollectionDocument } from 'collections/Collection';
import { Meteor } from 'utils/Meteor';
import { defer } from 'lodash';

interface MeteorDDPEvent<F> {
    id: string;
    collection: string;
    msg: string;
    fields?: F;
    cleared?: {
        [param: string]: any;
    };
}

interface TrackerCollectionChangeEvent<CD> {
    _id: string;
    changedFields?: Partial<CD>;
    currentDocument?: CD;
}

interface TrackerOptions<CD> {
    collection: string;
    onChange: (event: TrackerCollectionChangeEvent<CD>) => void;
}

export class Tracker<CD extends CollectionDocument> {
    private tracker: Function;

    constructor({ collection, onChange }: TrackerOptions<CD>) {
        Meteor.ddp.on('changed', this.onDataChange);
        Meteor.ddp.on('added', this.onDataAdd);

        this.tracker = onChange;
    }

    public destroy = () => {
        Meteor.ddp.off('changed', this.onDataChange);
        Meteor.ddp.off('added', this.onDataAdd);
    }

    private triggerTrackers = (event: MeteorDDPEvent<Partial<CD>>): void => {
        const { collection, id: _id, fields } = event;

        const currentDocument = Meteor
            .collection(collection)
            .findOne({ _id }) as CD;

        const changeEvent: TrackerCollectionChangeEvent<CD> = {
            _id,
            changedFields: fields,
            currentDocument,
        };

        defer(() => this.tracker(changeEvent));
    }

    private onDataChange = (event: MeteorDDPEvent<Partial<CD>>): void => {
        this.triggerTrackers(event);
    }

    private onDataAdd = (event: MeteorDDPEvent<Partial<CD>>): void => {
        this.triggerTrackers(event);
    }
}

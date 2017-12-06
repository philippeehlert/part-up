import { Meteor } from 'utils/Meteor';
import { defer, filter } from 'lodash';

interface DDPEvent {
    id: string;
    collection: string;
    msg: string;
    fields?: {
        [param: string]: any;
    };
    cleared?: {
        [param: string]: any;
    };
}

interface CollectionChangeEvent {
    collection: string;
    _id: string;
    fields?: {
        [param: string]: any;
    };
}

type CollectionTrackerHandler = (event: CollectionChangeEvent) => void;

interface CollectionTracker {
    name: string;
    handler: CollectionTrackerHandler;
}
type CollectionTrackerCreator = (collection: string, handler: CollectionTrackerHandler) => CollectionTracker;

interface SubscriberOptions {
    subscription: string;
    onChange?: Function;
    onAdd?: Function;
    track?: Array<CollectionTracker> | CollectionTracker;
}

interface Subscription {
    subscriptionId: string;
    ready: Function;
    stop: Function;
}

export const trackCollection: CollectionTrackerCreator = (name, callback) => {
    return {
        name,
        handler: callback,
    };
};

export class Subscriber {

    private subscription: string = '';

    private activeSubscription: any = undefined;

    private changeTracker: any = undefined;

    private trackers: Array<CollectionTracker> = [];

    constructor({ subscription, onChange, onAdd, track }: SubscriberOptions) {
        this.subscription = subscription;
        this.onChange = onChange || this.onChange;
        this.onAdd = onAdd || this.onAdd;
        if (track) this.attachTrackers(track);
    }

    public subscribe = (...parameters: any[]): Promise<void> => {
        return new Promise((resolve, reject) => {
            const subscription = Meteor.subscribe(this.subscription, ...parameters, {
                onReady: () => {
                    this.onChange();
                    resolve();
                },
                onStop: () => {
                    this.onChange();
                    reject();
                },
            }) as Subscription;

            if (this.activeSubscription) this.activeSubscription.stop();
            this.activeSubscription = subscription;

            this.track(subscription);
        });
    }

    public unsubscribe = (): void => {
        if (this.activeSubscription) this.activeSubscription.stop();
        if (this.changeTracker) Meteor.ddp.off('changed', this.onDataChange);
    }

    public destroy = (): void => {
        this.unsubscribe();
        this.onChange = () => {
            //
        };
    }

    private onDataChange = (event: DDPEvent): void => {
        defer(() => {
            this.onChange(event);
            this.triggerTrackers(event);
        });
    }

    private attachTrackers = (track: Array<CollectionTracker> | CollectionTracker): void => {
        if (Array.isArray(track)) {
            track.forEach((tracker) => {
                this.attachTracker(tracker);
            });
        } else {
            this.attachTracker(track);
        }
    }

    private attachTracker = (tracker: CollectionTracker): void => {
        this.trackers.push(tracker);
    }

    private triggerTrackers = (event: DDPEvent): void => {
        const { collection, id: _id, fields } = event;

        const triggers = filter(this.trackers, { name: collection });
        triggers.forEach((tracker) => tracker.handler({ _id, collection, fields }));
    }

    private track = (subscription: Subscription): void => {
        if (this.changeTracker) Meteor.ddp.off('changed', this.onDataChange);
        this.changeTracker = Meteor.ddp.on('changed', this.onDataChange);
    }

    private onChange: Function = (): void => {
        //
    }

    private onAdd: Function = (): void => {
        //
    }
}

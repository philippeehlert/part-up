import { Meteor } from 'utils/Meteor';
import { defer } from 'lodash';

interface SubscriberOptions {
    subscription: string;
    onChange?: Function;
}

interface Subscription {
    subscriptionId: string;
    ready: Function;
    stop: Function;
}

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

export class Subscriber {

    private subscription: string = '';

    private activeSubscription: any = undefined;

    private tracker: any = undefined;

    constructor({ subscription, onChange }: SubscriberOptions) {
        this.subscription = subscription;
        this.onChange = onChange || this.onChange;
    }

    /**
     * @param  {any[]} ...parameters
     * @returns Promise
     */
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

    /**
     * @returns void
     */
    public unsubscribe = (): void => {
        if (this.activeSubscription) this.activeSubscription.stop();
        if (this.tracker) Meteor.ddp.off('changed', this.onDataChange);
    }

    /**
     * @returns void
     */
    public destroy = (): void => {
        this.unsubscribe();
        this.onChange = () => {
            //
        };
    }

    /**
     * @param  {DDPEvent} event
     * @returns void
     */
    private onDataChange = (event: DDPEvent): void => {
        defer(() => this.onChange(event));
    }

    /**
     * @param  {Subscription} subscription
     * @returns void
     */
    private track = (subscription: Subscription): void => {
        if (this.tracker) Meteor.ddp.off('changed', this.onDataChange);
        this.tracker = Meteor.ddp.on('changed', this.onDataChange);
        console.log('tracker', this.tracker);
    }

    private onChange: Function = (): void => {
        //
    }
}

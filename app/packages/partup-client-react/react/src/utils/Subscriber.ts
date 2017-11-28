import { Meteor } from 'utils/Meteor';
import { defer } from 'lodash';

interface SubscriberOptions {
    subscription: string
    onChange?: Function
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
     * Subscribe to the provided subscriptions.
     *
     * @throws Throws Error when adding duplicate subscriptions.
     */
    public async subscribe(...parameters: any[]) {
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
            });

            if (this.activeSubscription) this.activeSubscription.stop();
            this.activeSubscription = subscription;

            this.track(subscription);
        });
    }

    public unsubscribe() {
        if (this.activeSubscription) this.activeSubscription.stop();
        if (this.tracker) Meteor.ddp.off('changed', this.onDataChange);
    }

    public destroy() {
        this.unsubscribe();
        this.onChange = () => {
            //
        };
    }

    private onDataChange = (event: any) => {
        defer(() => this.onChange());
    }

    private track = (subscription: any) => {
        if (this.tracker) Meteor.ddp.off('changed', this.onDataChange);
        this.tracker = Meteor.ddp.on('changed', this.onDataChange);
    }

    private onChange: Function = () => {
        //
    }
}

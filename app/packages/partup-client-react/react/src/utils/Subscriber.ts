import { Meteor } from 'utils/Meteor';
import { defer } from 'lodash';

interface SubscriberDDPEvent {
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

interface SubscriberOptions {
    subscription: string;
    onChange?: Function;
    onAdd?: Function;
}

interface Subscription {
    subscriptionId: string;
    ready: Function;
    stop: Function;
}

interface SubscriberState {
    ready: boolean;
}

export class Subscriber {

    public state: SubscriberState = {
        ready: false,
    };

    private subscription: string = '';

    private activeSubscription: any = undefined;

    private changeTracker: any = undefined;

    constructor({ subscription, onChange, onAdd }: SubscriberOptions) {
        this.subscription = subscription;
        this.onChange = onChange || this.onChange;
        this.onAdd = onAdd || this.onAdd;
    }

    public subscribe = (...parameters: any[]): Promise<void> => {
        return new Promise((resolve, reject) => {

            if (this.state.ready) {
                this.setState({
                    ready: false,
                });
            }

            const subscription = Meteor.subscribe(this.subscription, ...parameters, {
                onReady: () => {
                    this.setState({
                        ready: true,
                    });
                    resolve();
                },
                onStop: () => {
                    this.setState({
                        ready: false,
                    });
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

    private onDataChange = (event: SubscriberDDPEvent): void => {
        defer(() => {
            this.onChange(event);
        });
    }

    private setState = (newState: Partial<SubscriberState>) => {
        this.state = {
            ...this.state,
            ...newState,
        };
        this.onChange();
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

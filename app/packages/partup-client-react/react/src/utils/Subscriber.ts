import { Meteor } from 'utils/Meteor';

interface SubscriberOptions {
    subscription: string;
    onStateChange?: Function;
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

    constructor({ subscription, onStateChange }: SubscriberOptions) {
        this.subscription = subscription;
        this.onStateChange = onStateChange || this.onStateChange;
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
        });
    }

    public unsubscribe = (): void => {
        if (this.activeSubscription) this.activeSubscription.stop();
    }

    public destroy = (): void => {
        this.unsubscribe();
        this.onStateChange = () => {
            //
        };
    }

    private setState = (newState: Partial<SubscriberState>) => {
        this.state = {
            ...this.state,
            ...newState,
        };
        this.onStateChange();
    }

    private onStateChange: Function = (): void => {
        //
    }
}

import Meteor from 'utils/Meteor';

type Subscription = {
    name: string;
    parameters?: Array<any>;
};

type SubscriberOptions = {
    subscriptions: Array<Subscription>;
    onChange?: Function;
};

export default class Subscriber<SubscriberData> {

    public data: SubscriberData;

    private subscriptions: Array<Subscription> = [];

    private activeSubscriptions: {
        [subname: string]: {
            subscription: any;
        };
    } = {};

    constructor({subscriptions, onChange}: SubscriberOptions) {
        this.subscriptions = subscriptions;
        this.onChange = onChange || this.onChange;
        this.data = {} as SubscriberData;
    }

    /**
     * Subscribe to the provided subscriptions.
     *
     * @throws Throws Error when adding duplicate subscriptions.
     */
    public subscribe() {
        this.subscriptions.forEach(({name, parameters = []}) => {
            if (this.activeSubscriptions[name]) {
                throw new Error('Subscription already active');
            }

            const sub = Meteor.subscribe(name, ...parameters, {
                onReady: () => {
                    this.onChange();
                },
                onStop: () => {
                    this.onChange();
                }
            });

            this.activeSubscriptions[name] = {
                subscription: sub,
            };
        });
    }

    public unsubscribe(subname: string) {
        this.activeSubscriptions[subname].subscription.stop();
        delete this.activeSubscriptions[subname];
    }

    public destroy() {
        for (const key in this.activeSubscriptions) {
            if (this.activeSubscriptions.hasOwnProperty(key)) {
                this.unsubscribe(key);
            }
        }

        this.onChange = () => {};
    }

    private onChange: Function = () => {};
}

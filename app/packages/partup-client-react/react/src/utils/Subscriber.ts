import Meteor from 'utils/Meteor';

type Subscription = {
    name: string;
    collection: string;
    parameters?: Array<any>;
};

type SubscriberOptions = {
    subscriptions: Array<Subscription>;
    onChange?: Function;
    transformData?: Function;
};

export default class Subscriber<SubscriberData> {

    public data: SubscriberData;

    private collections = {};

    private subscriptions: Array<Subscription> = [];

    private activeSubscriptions: {
        [subname: string]: {
            subscription: any;
            collection: string;
        };
    } = {};

    constructor({subscriptions, onChange, transformData}: SubscriberOptions) {
        this.subscriptions = subscriptions;
        this.onChange = onChange || this.onChange;
        this.transformData = transformData || this.transformData;
        this.data = {} as SubscriberData;
    }

    /**
     * Subscribe to the provided subscriptions.
     *
     * @throws Throws Error when adding duplicate subscriptions.
     */
    public subscribe() {
        this.subscriptions.forEach(({name, collection, parameters = []}) => {
            if (this.activeSubscriptions[name]) {
                throw new Error('Subscription already active');
            }

            const sub = Meteor.subscribe(name, ...parameters, {
                onReady: () => {
                    this.collections[collection] = Meteor.collection(collection);
                    this.data = this.transformData(this.collections);
                    this.onChange();
                },
            });

            this.activeSubscriptions[name] = {
                subscription: sub,
                collection,
            };
        });
    }

    public unsubscribe(subname: string) {
        this.activeSubscriptions[subname].subscription.stop();
        delete this.data[this.activeSubscriptions[subname].collection];
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
    private transformData: Function = () => {};
}

import Meteor from 'utils/Meteor';


type Subscription = {
    name: string;
    collection: string;
}

export default class Subscriber {

    public data: any = {};

    private subscriptions: Array<Subscription> = [];

    private activeSubscriptions: {
        [subname: string]: {
            subscription: any;
            collection: string;
        };
    } = {};
    
    private onChange: Function = () => {};

    constructor({subscriptions, onChange} : {subscriptions: Array<Subscription>, onChange?: Function}) {
        this.subscriptions = subscriptions;
        this.onChange = onChange || this.onChange;
    }

    /**
     * Subscribe to the provided subscriptions.
     * 
     * @throws Throws Error when adding duplicate subscriptions.
     */
    subscribe() {
        this.subscriptions.forEach(({name, collection}) => {
            if (this.activeSubscriptions[name]) throw new Error('Subscription already active');

            const sub = Meteor.subscribe(name, {
                onReady: () => {
                    this.data[collection] = Meteor.collection(collection).find();
                    this.onChange();
                }
            });
            
            this.activeSubscriptions[name] = {
                subscription: sub,
                collection,
            };
        })
    }
    
    unsubscribe(subname: string) {
        this.activeSubscriptions[subname].subscription.stop();
        delete this.data[this.activeSubscriptions[subname].collection];
        delete this.activeSubscriptions[subname];
    }
    
    destroy() {
        for (const key in this.activeSubscriptions) {
            this.unsubscribe(key);
        }

        this.onChange = () => {};
    }
}
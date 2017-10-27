

## if you want fonts to work use
to open chrome `open -a Google\ Chrome --args --disable-web-security --user-data-dir`

# getting started

- open chrome `open -a Google\ Chrome --args --disable-web-security --user-data-dir`
- `cd app/packages/partup-client-react/react && yarn start`
- in another window, from project root, run `./start --once --react-dev`


# icon generating

1. add icon.svg to src/static/icons
2. run `yarn generate-icons`

# Component example 

```ts

interface Props {
    match?: {
        url?: string;
    };
    location?: Object;
    history?: Object;
}

interface State {
    user: any;
}

type Partup = {
    _id: string;
    name: string;
};

interface SubscriberData {
    partups: Array<Partup>;
    singlePartup: Partup;
}

export default class Component extends React.Component<Props, State> {

  private subscriptions = new Subscriber<SubscriberData>({
        subscriptions: [{
            name: 'partups.one',
            collection: 'partups',
            parameters: [
                partupId,
            ],
        }, {
            name: 'partups.list',
            collection: 'partups',
        }],
        transformData: (collections: any) => {
            return {
                singlePartup: collections.partups.findOne({_id: partupId}),
                partups: collections.partups.find(),
            };
        },
        onChange: () => this.forceUpdate(),
    });

    private fetcher = new Fetcher({
        route: '/partups/discover',
    });

    componentWillMount() {
        this.fetcher.fetch();
        this.subscriptions.subscribe();
    }

    componentWillUnmount() {
        this.subscriptions.destroy();
    }

    onRandomName = () => {
        Meteor.call('users.update', {
            name: 'w00t',
        }, () => {
            this.setState({
                user: Meteor.collection('users').findOne({_id: 'a7qcp5RHnh5rfaeW9'}),
            });
        });
    }

    onLogin = () => {
        Meteor.loginWithPassword('judy@example.com', 'user', (...args: any[]) => {
            this.setState({
                user: Meteor.collection('users').findOne({_id: 'a7qcp5RHnh5rfaeW9'}),
            });
        });
    }

    render() {
      //
    }
}
```
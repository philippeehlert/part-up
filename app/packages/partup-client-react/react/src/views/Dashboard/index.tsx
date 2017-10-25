import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import Meteor from 'utils/Meteor';
import { get } from 'lodash';

import Subscriber from 'utils/Subscriber';
import Fetcher from 'utils/Fetcher';

import {
    View,
    SideBarView,
} from 'components';

import List, {
    ListItem,
} from 'components/List';

import { Link } from 'components/Router';

import ActivitiesView from './routes/Activities';
import InvitesView from './routes/Invites';
import RecommendationsView from './routes/Recommendations';

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

const partupId = 'vGaxNojSerdizDPjc';

export default class Dashboard extends React.Component<Props, State> {
    static defaultProps: Props = {
        match: {
            url: '',
        },
    };

    public state: State = {
        user: {},
    };

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

    render() {
        const { match = {} }: Props = this.props;

        return (
            <SideBarView
                sidebar={
                    <List>
                        <ListItem>
                            <Link to={`${match.url}`}>ConversationsView</Link>
                        </ListItem>
                        <ListItem>
                            <Link to={`${match.url}/activities`}>ActivitiesView</Link>
                        </ListItem>
                        <ListItem>
                            <Link to={`${match.url}/invites`}>InvitesView</Link>
                        </ListItem>
                        <ListItem>
                            <Link to={`${match.url}/recommendations`}>RecommendationsView</Link>
                        </ListItem>
                    </List>
                }>

                <ReactRouter.Switch>
                    <ReactRouter.Route path={`${match.url}/activities`} component={ActivitiesView} />
                    <ReactRouter.Route path={`${match.url}/invites`} component={InvitesView} />
                    <ReactRouter.Route path={`${match.url}/recommendations`} component={RecommendationsView} />
                    <ReactRouter.Route exact path={`${match.url}`} render={this.renderMaster} />
                </ReactRouter.Switch>
            </SideBarView>
        );
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

    renderMaster = () => {
        const { user } = this.state;

        return (
            <View>
                {`Conversationss (${get(user, 'profile.name')})`}
                <button onClick={this.onLogin}>
                    login
                </button>
                <button onClick={this.onRandomName}>
                    random name change
                </button>
            </View>
        );
    }
}

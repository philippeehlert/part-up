import * as React from 'react';
import * as ReactRouter from 'react-router-dom';

import Subscriber from 'utils/Subscriber';

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

export default class Dashboard extends React.Component<Props, {}> {

    private subscriptions = new Subscriber({
        subscriptions: [{
            name: 'partups.list',
            collection: 'partups',
        }],
        onChange: () => this.forceUpdate(),
    });

    static defaultProps: Props = {
        match: {
            url: '',
        },
    };

    componentWillMount() {
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

    renderMaster = () => {
        const { data } = this.subscriptions

        return (
            <View>
                Conversationss
                { (data.partups || []).map((partup: any) => partup.name) }
            </View>
        );
    }
}

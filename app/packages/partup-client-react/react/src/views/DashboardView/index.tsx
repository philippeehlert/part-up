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
    match?: Object;
    location?: Object;
    history?: Object;
}

export default class DashboardView extends React.Component<Props, {}> {

    private subscriptions = new Subscriber({
        subscriptions: [{
            name: 'partups.list',
            collection: 'partups',
        }],
        onChange: () => this.forceUpdate(),
    });
    
    // private fetcher = new Fetcher({
    //     routes: [
    //         '/partups/discover'
    //     ],
    //     onChange: () => this.forceUpdate(),
    //     // transformData: (data) => {
    //     //     return {
    //     //         partups: data['/partups/discover'],
    //     //     }
    //     // }
    // })

    componentWillMount() {
        this.subscriptions.subscribe();
    }

    componentWillUnmount() {
        this.subscriptions.destroy();
    }

    render() {
        return (
            <SideBarView
                sidebar={
                    <List>
                        <ListItem>
                            <Link to={'/'}>ConversationsView</Link>
                        </ListItem>
                        <ListItem>
                            <Link to={'/activities'}>ActivitiesView</Link>
                        </ListItem>
                        <ListItem>
                            <Link to={'/invites'}>InvitesView</Link>
                        </ListItem>
                        <ListItem>
                            <Link to={'/recommendations'}>RecommendationsView</Link>
                        </ListItem>
                    </List>
                }>
                
                <ReactRouter.Switch>
                    <ReactRouter.Route path={'/activities'} component={ActivitiesView} />
                    <ReactRouter.Route path={'/invites'} component={InvitesView} />
                    <ReactRouter.Route path={'/recommendations'} component={RecommendationsView} />
                    <ReactRouter.Route exact path={'/'} render={this.renderMaster} />
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

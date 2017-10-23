import * as React from 'react';
import * as ReactRouter from 'react-router-dom';

import {
    View,
    SideBarView,
} from '../../components';

import List, {
    ListItem,
} from '../../components/List';

import { Link } from '../../components/Router';

import ActivitiesView from './routes/Activities';
import InvitesView from './routes/Invites';
import RecommendationsView from './routes/Recommendations';

interface Props {
    match?: Object;
    location?: Object;
    history?: Object;
};

export default class DashboardView extends React.Component<Props, {}> {

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
    };

    renderMaster = () => (
        <View>
            Conversations
        </View>
    );
};

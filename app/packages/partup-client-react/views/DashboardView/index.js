import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

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

export default class DashboardView extends Component {

    static propTypes = {
        match: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object,
    };

    static defaultProps = {

    };

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
                <Switch>
                    <Route path={'/activities'} component={ActivitiesView} />
                    <Route path={'/invites'} component={InvitesView} />
                    <Route path={'/recommendations'} component={RecommendationsView} />
                    <Route exact path={'/'} render={this.renderMaster} />
                </Switch>
            </SideBarView>
        );
    };

    renderMaster = () => (
        <View>
            Conversations
        </View>
    );
};

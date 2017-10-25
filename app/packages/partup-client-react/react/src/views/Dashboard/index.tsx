import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

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

// We need to define these here instead of using RouteComponentProps
// Because of the custom 'router' component used.
interface Props {
    match?: {
        url?: string;
    };
    location?: Object;
    history?: Object;
}

interface State {}

export default class Dashboard extends React.Component<Props, State> {
    static defaultProps = {
        match: {
            url: '',
        },
    };

    render() {
        const { match = {} } = this.props;

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

                <Switch>
                    <Route path={`${match.url}/activities`} component={ActivitiesView} />
                    <Route path={`${match.url}/invites`} component={InvitesView} />
                    <Route path={`${match.url}/recommendations`} component={RecommendationsView} />
                    <Route exact path={`${match.url}`} render={this.renderMaster} />
                </Switch>
            </SideBarView>
        );
    }

    private renderMaster = () => {
        return (
            <View>
                Master dashboard view.
            </View>
        );
    }
}

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
    SideBarView,
    Icon,
} from 'components';

import List, {
    ListItem,
} from 'components/List';

import { ContentView } from 'components/View';

import ActivitiesView from './routes/Activities';
import InvitesView from './routes/Invites';
import RecommendationsView from './routes/Recommendations';

import { SideBar } from './implementations';

// We need to define these here instead of using RouteComponentProps
// Because of the custom 'router' component used.
interface Props {
    match?: {
        url?: string;
    };
    location?: Object;
    history: any;
}

export default class Dashboard extends React.Component<Props, {}> {
    static defaultProps = {
        match: {
            url: '',
        }
    };

    render() {
        const { match = {}, history } = this.props;

        const currentRoute = history && history.location ? history.location.pathname : '';
        console.log(currentRoute);

        return (
            <SideBarView sidebar={<SideBar currentRoute={currentRoute} baseUrl={match.url as string}/>}>
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
            <ContentView>
                <List>
                    <ListItem>
                        <Icon name={'archive'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'arrow-down'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'arrow-left'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'arrow-right'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'arrow-up'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'bell'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'calendar-check'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'caret-down'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'caret-left'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'caret-right'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'caret-slim-down'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'caret-slim-left'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'caret-slim-right'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'caret-slim-up'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'caret-up'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'chart'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'chat'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'check'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'checkbox'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'cog'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'crossroad'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'documents'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'download'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'drive'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'dropbox'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'facebook'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'globe'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'info-outline'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'info'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'instagram'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'linkedin'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'location'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'lock-closed'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'lock-open'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'megaphone'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'message'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'monitor'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'monkeytail'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'network'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'pencil'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'person-plus'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'photo'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'plus'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'profile-card'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'question'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'search'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'share'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'show'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'times'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'twitter'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'unarchive'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'upload'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'video'} />
                    </ListItem>
                    <ListItem>
                        <Icon name={'warning'} />
                    </ListItem>
                </List>
            </ContentView>
        );
    }
}

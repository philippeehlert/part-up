import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
    SideBarView,
    Icon,
    Button,
} from 'components';

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
        },
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
                <Button leftChild={<Icon name={'message'} />}>Hello</Button>
            </ContentView>
        );
    }
}

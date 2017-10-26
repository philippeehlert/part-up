import * as React from 'react';
import * as PropTypes from 'prop-types';
import Meteor from 'utils/Meteor';
import Subscriber from 'utils/Subscriber';
import {
    Switch,
    Route,
} from 'react-router-dom';
import { User } from 'types/User';

import DashboardView from './views/Dashboard';
import HomeView from './views/Home';

import { View } from 'components';
import RouterContainer from 'components/Router';

import { onRouteChange } from 'utils/router';

import {
    DevelopmentNavigation,
} from 'implementations';

const dev = process.env.REACT_APP_DEV;

interface Props {
    className?: string;
}

class Container extends React.Component<Props, {}> {

    static contextTypes = {
        router: PropTypes.object,
    };

    constructor(props: Props, context: any) {
        super(props);

        if (!dev) {
            onRouteChange((currentRoute: string) => {
                context.router.history.push(currentRoute);
            });
        }
    }

    render() {
        const { children } = this.props;

        if (dev) {
            return (
                <View>
                    <DevelopmentNavigation />
                    {children}
                </View>
            );
        }

        return (
            <View>
                <RouterContainer>
                    {children}
                </RouterContainer>
            </View>
        );
    }
}

interface State {
    user?: User;
    loginFailed: boolean;
}

interface SubscriberData {
    users: Array<User>;
}

export interface AppContext {
    user?: User;
    refetchUser: Function;
}

export default class App extends React.Component<Props, State> {

    static childContextTypes = {
        user: PropTypes.object,
        refetchUser: PropTypes.func,
    };

    public state: State = {
        user: undefined,
        loginFailed: false,
    };

    private subscriptions = new Subscriber<SubscriberData>({
        subscriptions: [{
            name: 'users.loggedin',
        }],
        onChange: () => this.forceUpdate(),
    });

    getChildContext(): AppContext {
        const { user } = this.state;

        return {
            user,
            refetchUser: this.refetchUser,
        };
    }

    refetchUser = () => {
        this.setState({
            user: Meteor.user(),
        });
    }

    componentWillMount() {
        this.subscriptions.subscribe();
        this.refetchUser();

        Meteor.Accounts.onLogin(() => {
            this.setState({ loginFailed: false });
            this.refetchUser();
        });

        Meteor.Accounts.onLoginFailure(() => {
            this.setState({ loginFailed: true });
        });
    }

    render() {
        const { loginFailed, user } = this.state;

        if (loginFailed) {
            return (
                <div>TODO: Login failed Please login @ partup</div>
            );
        }

        if (!user) {
            return (
                <div>TODO: Empty state</div>
            );
        }

        return (
            <Container>
                <Switch>
                    <Route path={'/home'} component={DashboardView}/>
                    <Route exact component={HomeView}/>
                </Switch>
            </Container>
        );
    }
}

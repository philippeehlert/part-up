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
import { error, success } from 'utils/notify';

import { routes, activeRoutes, onRouteChange } from 'utils/router';
import NotificationsManager from 'components/NotificationsManager';

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

    componentWillMount() {
        if (!dev) {
            onRouteChange((currentRoute: string) => {
                this.context.router.history.push(currentRoute);
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

    private subscriptions = new Subscriber({
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
        // Meteor.loginWithPassword('ralph@part-up.com', 'Testpassword1')
        Meteor.Accounts.onLogin(() => {
            this.setState({ loginFailed: false });
            this.refetchUser();
            success({
                title: 'Login success',
                content: `Successfully logged in as ${Meteor.userId()}`,
            });
        });

        Meteor.Accounts.onLoginFailure(() => {
            this.setState({ loginFailed: true });
            error({
                title: 'Login failed',
                content: 'Failed to login...',
                error: new Error('Login failed'),
            });
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
                    { routes.filter((route) => !activeRoutes.includes(route)).map((route, index) => (
                        <Route key={index} path={route} component={HomeView} />
                    )) }
                </Switch>
                <NotificationsManager />
                />
            </Container>
        );
    }
}

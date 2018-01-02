import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as moment from 'moment';
import { Meteor, onLogin, onLoginFailure, loginWithMeteorToken, onLogout } from 'utils/Meteor';
import { Subscriber } from 'utils/Subscriber';
import {
    Switch,
    Route,
} from 'react-router-dom';
import { error } from 'utils/notify';
import { onRouteChange } from 'utils/router';
import { View } from 'components/View/View';
import { DevelopmentNavigation } from 'implementations/DevelopmentNavigation';
import { Router } from 'components/Router/Router';
import { NotificationsManager } from 'components/NotificationsManager/NotificationsManager';
import { Dashboard } from 'views/Dashboard/Dashboard';
import { Start } from 'views/Partup/Start';
import { UserDocument } from 'collections/Users';
import { get } from 'lodash';

import 'moment/locale/nl';
import { userDispatcher } from 'index';

const dev = process.env.REACT_APP_DEV;

interface Props {
    className?: string;
}

class Container extends React.Component<Props, {}> {

    public static contextTypes = {
        router: PropTypes.object,
    };

    public componentWillMount() {
        if (!dev) {
            onRouteChange((currentRoute: string) => {
                this.context.router.history.push(currentRoute);
            });
        }
    }

    public render() {
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
                <Router>
                    {children}
                </Router>
            </View>
        );
    }
}

interface State {
    user?: UserDocument;
    loginFailed: boolean;
}

export interface AppContext {
    user?: UserDocument;
    refetchUser: Function;
}

export type renderInstanceType = 'home' | 'partup-start';

interface AppProps extends Props {
    render: renderInstanceType;
    data: any;
}

export class App extends React.Component<AppProps, State> {

    public static childContextTypes = {
        user: PropTypes.object,
        refetchUser: PropTypes.func,
    };

    public state: State = {
        user: undefined,
        loginFailed: false,
    };

    private userSubscription = new Subscriber({
        subscription: 'users.loggedin',
        onStateChange: () => this.forceUpdate(),
    });

    public getChildContext(): AppContext {
        const { user } = this.state;

        return {
            user,
            refetchUser: this.refetchUser,
        };
    }

    public loadData = async () => {
        await this.userSubscription.subscribe();
        this.refetchUser();

        onLogin(async () => {
            this.setState({ loginFailed: false });
            this.refetchUser();
            const user = Meteor.user();

            const locale = get(user, 'profile.settings.locale') || 'en';

            moment.locale(locale);
        });

        onLoginFailure(() => {
            this.setState({ loginFailed: true });
            error({
                title: 'Login failed',
                content: 'Failed to login...',
                error: new Error('Login failed'),
            });
        });
    }

    public componentWillMount() {
        this.loadData();

        loginWithMeteorToken();

        userDispatcher.subscribe('login', this.userLoginHandler);
        userDispatcher.subscribe('logout', this.userLogoutHandler);
    }

    public componentWillUnmount() {
        userDispatcher.unsubscribe('login', this.userLoginHandler);
        userDispatcher.unsubscribe('logout', this.userLogoutHandler);
    }

    public render() {
        if (dev) {
            const partupId = 'zcJyRkPhTNqQjNKEZ';

            return (
                <Container>
                    <Switch>
                        <Route path={'/home'} component={Dashboard}/>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '0 0 400px', height: '100vh', background: '#eeeeee' }} />
                            <div style={{ flex: '1', height: '100vh', padding: '2.5em', background: '#e6e6e6' }}>
                                <Route path={'/partup-start'} render={(props) => <Start {...props} partupId={partupId} />} />
                            </div>
                        </div>
                    </Switch>
                    <NotificationsManager />
                </Container>
            );
        }

        return (
            <Container>
                {this.renderInstance()}
                <NotificationsManager />
            </Container>
        );

    }

    private renderInstance = () => {
        const { render, data } = this.props;

        // Not a logged in route
        if (render === 'partup-start') {
            return <Route path={'/'} render={(props) => <Start {...props} partupId={data.partupId} />} />;
        }

        // Logged in routes.
        const { loginFailed, user } = this.state;

        if (loginFailed || !user) {
            return null;
        }

        if (render === 'home') {
            return <Route path={'/home'} component={Dashboard} />;
        }

        return undefined;
    }

    private refetchUser = () => {
        this.setState({
            user: Meteor.user(),
        });
    }

    private userLoginHandler = () => {
        loginWithMeteorToken();
    }

    private userLogoutHandler = () => {
        Meteor.logout();

        onLogout();

        this.setState({
            user: undefined,
        });
    }
}

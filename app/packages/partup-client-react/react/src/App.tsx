import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as moment from 'moment';
import { Meteor, onLogin, onLoginFailure } from 'utils/Meteor';
import { Subscriber } from 'utils/Subscriber';
import {
    Switch,
    Route,
} from 'react-router-dom';
import { error, success } from 'utils/notify';
import { onRouteChange } from 'utils/router';
import { View } from 'components/View/View';
import { DevelopmentNavigation } from 'implementations/DevelopmentNavigation';
import { Router } from 'components/Router/Router';
import { NotificationsManager } from 'components/NotificationsManager/NotificationsManager';
import { Dashboard } from 'views/Dashboard/Dashboard';
import { UserDocument } from 'collections/Users';
import { get } from 'lodash';

import 'moment/locale/nl';

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

            success({
                title: 'Login success',
                content: `Successfully logged in as ${user.profile.name}`,
            });
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
    }

    public render() {
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

        if (dev) {
            return (
                <Container>
                    <Switch>
                        <Route path={'/home'} component={Dashboard}/>
                        <Route path={'/partup-start'} render={() => <div>Start</div>}/>
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
        const { render } = this.props;

        window.console.log(render);

        switch (render) {
        case 'home':
            return <Route path={'/'} component={Dashboard}/>;
        case 'partup-start':
            return <Route path={'/'} render={() => <div>Start</div>}/>;
        default:
            return undefined;
        }
    }

    private refetchUser = () => {
        this.setState({
            user: Meteor.user(),
        });
    }
}

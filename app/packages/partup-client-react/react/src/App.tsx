import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
    Switch,
    Route,
} from 'react-router-dom';

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

export default class App extends React.Component<Props, {}> {

    render() {

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
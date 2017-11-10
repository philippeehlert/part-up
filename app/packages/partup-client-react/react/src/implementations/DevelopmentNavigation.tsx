import * as React from 'react';

import {
    NavigationBar,
} from 'components';

import { MainNavLink } from 'components/Router';
import List, { ListItem } from 'components/List';

export default class DevelopmentNavigation extends React.Component {
    render() {
        return (
            <NavigationBar>
                <List horizontal spaced>
                    <ListItem>
                        <MainNavLink to={'/'} exact>
                            part-up
                        </MainNavLink>
                    </ListItem>
                    <ListItem>
                        <MainNavLink to={'/home'}>
                            dashboard
                        </MainNavLink>
                    </ListItem>
                    <ListItem alignRight>
                        <span style={{padding: '15px', display: 'block'}}>
                            Partup React Development Environment
                        </span>
                    </ListItem>
                </List>
            </NavigationBar>
        );
    }
}

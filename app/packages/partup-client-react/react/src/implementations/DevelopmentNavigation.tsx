import * as React from 'react';
import { NavigationBar } from 'components/NavigationBar/NavigationBar';
import { List } from 'components/List/List';
import { MainNavLink } from 'components/Router/MainNavLink';
import { ListItem } from 'components/List/ListItem';

export class DevelopmentNavigation extends React.Component {

    public render() {
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
                        <span style={{ padding: '15px', display: 'block' }}>
                            Partup React Development Environment
                        </span>
                    </ListItem>
                </List>
            </NavigationBar>
        );
    }
}

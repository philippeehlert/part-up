import * as React from 'react';
import { View } from 'components/View/View';
import { List } from 'components/List/List';
import { ListItem } from 'components/List/ListItem';
import { Link } from 'components/Router/Link';

interface Props {
    match?: Object;
    location?: Object;
    history?: Object;
}

export class Home extends React.Component<Props, {}> {

    render() {
        return (
            <View>
                Welcome to the Part-up React development environment.

                <List>
                    <ListItem>
                        <Link to={'/home'}>Dashboard</Link>
                    </ListItem>
                </List>
            </View>
        );
    }
}

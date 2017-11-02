import * as React from 'react';

import {
    View,
} from 'components';

import { Link } from 'components/Router';
import List, { ListItem } from 'components/List';

interface Props {
    match?: Object;
    location?: Object;
    history?: Object;
}

export default class Home extends React.Component<Props, {}> {

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

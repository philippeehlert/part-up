import * as React from 'react';

import {
    View,
} from 'components';

interface Props {
    match?: Object;
    location?: Object;
    history?: Object;
}

export default class Home extends React.Component<Props, {}> {

    render() {
        return (
            <View>
                Home
            </View>
        );
    }
}

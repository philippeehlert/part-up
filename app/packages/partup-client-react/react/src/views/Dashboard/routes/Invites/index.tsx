import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import {
    View,
} from 'components';

interface Props extends RouteComponentProps<any> {
    //
}

export default class InvitesView extends React.Component<Props> {

    render() {
        return (
            <View>
                Invites View
            </View>
        );
    }
}

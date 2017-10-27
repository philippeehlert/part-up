import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { ContentView } from 'components/View';

interface Props extends RouteComponentProps<any> {
    //
}

export default class InvitesView extends React.Component<Props> {

    render() {
        return (
            <ContentView>
                Invites View
            </ContentView>
        );
    }
}

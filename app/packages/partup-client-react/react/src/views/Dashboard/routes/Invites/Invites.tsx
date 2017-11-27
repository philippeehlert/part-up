import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ContentView } from 'components/View/ContentView';

interface Props extends RouteComponentProps<any> {
    //
}

export class InvitesView extends React.Component<Props> {

    public render() {
        return (
            <ContentView>
                Invites View
            </ContentView>
        );
    }
}

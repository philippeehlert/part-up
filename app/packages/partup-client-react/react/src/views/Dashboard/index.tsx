import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
    SideBarView,
    Icon,
    Button,
} from 'components';

import PortalManager from 'components/PortalManager';

import ModalPortal, { ModalWindow, ModalHeader, ModalContent, ModalFooter } from 'components/PortalManager/ModalPortal';

import { ContentView } from 'components/View';

import ActivitiesView from './routes/Activities';
import InvitesView from './routes/Invites';
import RecommendationsView from './routes/Recommendations';

import { SideBar } from './implementations';

// import Form, {
//     FieldCollection,
//     FieldSet,
//     Input,
//     TextArea,
// } from 'components/Form';

// We need to define these here instead of using RouteComponentProps
// Because of the custom 'router' component used.
interface Props {
    match?: {
        url?: string;
    };
    location?: Object;
    history: any;
}

export default class Dashboard extends React.Component<Props, {}> {
    static defaultProps = {
        match: {
            url: '',
        },
    };

    render() {
        const { match = {}, history } = this.props;

        const currentRoute = history && history.location ? history.location.pathname : '';

        return (
            <SideBarView sidebar={<SideBar currentRoute={currentRoute} baseUrl={match.url as string}/>}>
                <Switch>
                    <Route path={`${match.url}/activities`} component={ActivitiesView} />
                    <Route path={`${match.url}/invites`} component={InvitesView} />
                    <Route path={`${match.url}/recommendations`} component={RecommendationsView} />

                    <Route exact path={`${match.url}`} render={this.renderMaster} />
                </Switch>
            </SideBarView>
        );
    }

    private renderMaster = () => {
        return (
            <ContentView>
                <PortalManager
                    renderHandler={(open) => (
                        <Button
                            onClick={open}
                            leftChild={<Icon name={'message'} />}>
                            Nieuw bericht
                        </Button>
                    )}
                    renderPortal={(close) => (
                        <ModalPortal onBackgroundClick={close}>
                            {/* <Form onSubmit={this.onSubmit}> */}
                                <ModalWindow>
                                    <ModalHeader
                                        onClose={close}
                                        title={'Plaats een nieuw bericht'} />
                                    <ModalContent>
                                        {`<FieldCollection>`}
                                            {`<Fieldset label={'Waar wil je het bericht plaatsen?'}>`}
                                                {`<Input placeholder={'Selecteer part-up'} />`}
                                            {`</Fieldset>`}
                                            {`<Fieldset label={'Wat wil je delen?'}>`}
                                                {`<TextArea placeholder={'Write a comment'} />`}
                                            {`</Fieldset>`}
                                        {`</FieldCollection>`}
                                    </ModalContent>
                                    <ModalFooter>
                                        {`<List horizontal>`}
                                            {`<ListItem alignRight>`}
                                                {`<Button>Annuleren</Button>`}
                                            {`</ListItem>`}
                                            {`<ListItem alignRight>`}
                                                {`<Button type={'submit'}>Plaats bericht</Button>`}
                                            {`</ListItem>`}
                                        {`</List>`}
                                    </ModalFooter>
                                </ModalWindow>
                            {/* </Form> */}
                        </ModalPortal>
                    )}
                />
            </ContentView>
        );
    }
}

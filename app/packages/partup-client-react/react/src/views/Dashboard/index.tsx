import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import {
    SideBarView,
    Icon,
    Button,
    Tile,
} from 'components';

import UpdateTile, { UpdateTileMeta, UpdateTileContent, UpdateTileComments } from 'components/UpdateTile';

import FilteredList, {
    FilteredListControls,
    FilteredListItems,
} from 'components/FilteredList';

import FillInTheBlanks, { Blank } from 'components/FillInTheBlanks';

import PortalManager from 'components/PortalManager';

import ModalPortal, {
    ModalWindow,
    ModalHeader,
    ModalContent,
    ModalFooter,
} from 'components/PortalManager/ModalPortal';

import { ContentView } from 'components/View';

import ActivitiesView from './routes/Activities';
import InvitesView from './routes/Invites';
import RecommendationsView from './routes/Recommendations';

import { SideBar } from './implementations';

import Subscriber from 'utils/Subscriber';
import Updates from 'collections/Updates';

// import Form, {
//     FieldCollection,
//     FieldSet,
//     Input,
//     TextArea,
// } from 'components/Form';

interface Props extends RouteComponentProps<any> {}

export default class Dashboard extends React.Component<Props, {}> {

    private subscriptions = new Subscriber({
        subscriptions: [
            {
                name: 'updates.from_partup',
                parameters: [
                    'gJngF65ZWyS9f3NDE',
                ],
            },
            {
                name: 'partups.list',
            },
        ],
        onChange: () => this.forceUpdate(),
    });

    componentWillMount() {
        this.subscriptions.subscribe();
    }

    componentWillUnmount() {
        this.subscriptions.destroy();
    }

    render() {
        const { match , history, location } = this.props;

        return (
            <SideBarView
                sidebar={
                    <SideBar
                        baseUrl={match.url}
                        navigator={{match, history, location}}
                    />
                }>
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
        const updates = Updates.getUpdatesForLoggedInUser();

        console.log(updates);

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

                <FilteredList>
                        <FilteredListControls>
                            <FillInTheBlanks>
                                <Blank label={'Toon updates als'}>
                                    <select>
                                        <option>hoi</option>
                                    </select>
                                </Blank>
                                <Blank label={'van'}>
                                    <select>
                                        <option>hoi</option>
                                    </select>
                                </Blank>
                            </FillInTheBlanks>
                        </FilteredListControls>
                        <FilteredListItems>
                            { updates.map(update => {
                                return (
                                    <Tile title={update.partup.name} key={update._id}>
                                        <UpdateTile>
                                            <UpdateTileMeta postedBy={update.createdBy} postedAt={update.created_at} />
                                            <UpdateTileContent>
                                                <div style={{
                                                    border: '2px solid #eee',
                                                    padding: '15px',
                                                    borderRadius: '4px',
                                                    textAlign: 'center',
                                                }}>
                                                    <p>
                                                        {update.type}<br /><small style={{fontSize: '0.75em'}}>
                                                            { JSON.stringify(update.type_data) }
                                                        </small>
                                                    </p>
                                                </div>
                                            </UpdateTileContent>
                                            <UpdateTileComments comments={update.comments || []} />
                                        </UpdateTile>
                                    </Tile>
                                );
                            }) }
                        </FilteredListItems>
                </FilteredList>

            </ContentView>
        );
    }

    // private renderUpdateComponent(update) {
    //     const table = {
    //         'partups_message_added': (data) => <MessageUpdate message={data} />,
    //         'partups_message_added': (data) => <ActivityUpdate activity={data} />,
    //     };

    //     return table[update.type](update);
    // }
}

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { translate } from 'utils/translate';

import { ActivitiesView } from 'views/Dashboard/routes/Activities/Activities';
import { InvitesView } from 'views/Dashboard/routes/Invites/Invites';
import { RecommendationsView } from 'views/Dashboard/routes/Recommendations/Recommendations';

import { SideBar } from 'views/Dashboard/implementations/SideBar';
import { ConversationUpdates } from 'views/Dashboard/implementations/ConversationUpdates';

import { SideBarView } from 'components/SideBarView/SideBarView';
import { ContentView } from 'components/View/ContentView';
import { PortalManager } from 'components/PortalManager/PortalManager';
import { Button } from 'components/Button/Button';
import { Icon } from 'components/Icon/Icon';
import { ModalPortal } from 'components/Modal/ModalPortal';
import { Form } from 'components/Form/Form';
import { FieldCollection } from 'components/Form/FieldCollection';
import { FieldSet } from 'components/Form/FieldSet';
import { Label } from 'components/Form/Label';
import { Input } from 'components/Form/Input';
import { List } from 'components/List/List';
import { ModalWindow } from 'components/Modal/ModalWindow';
import { ModalHeader } from 'components/Modal/ModalHeader';
import { ModalContent } from 'components/Modal/ModalContent';
import { ModalFooter } from 'components/Modal/ModalFooter';
import { ListItem } from 'components/List/ListItem';

interface Props extends RouteComponentProps<any> {}

export class Dashboard extends React.Component<Props, {}> {

    public render() {
        const { match , history, location } = this.props;

        return (
            <SideBarView
                sidebar={
                    <SideBar
                        baseUrl={'/home'}
                        navigator={{ match, history, location }}
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

    private renderMaster() {
        return (
            <ContentView>
                <PortalManager
                    renderHandler={(open) => (
                        <Button
                            onClick={open}
                            leftChild={<Icon name={'message'} />}>
                            {translate('pur-dashboard-conversations-button-new-message')}
                        </Button>
                    )}
                    renderPortal={(close) => (
                        <ModalPortal onBackgroundClick={close}>

                            <Form onSubmit={(e: any, fields: any) => {
                                // tslint:disable-next-line:no-console
                                console.log(fields);
                            }}>
                                <ModalWindow>
                                    <ModalHeader
                                        onClose={close}
                                        title={'Plaats een nieuw bericht'} />
                                    <ModalContent>
                                        <FieldCollection>
                                            <FieldSet>
                                                <Label label={'Field label'}>
                                                    <Input type={'text'} name={'fieldname'} />
                                                </Label>
                                            </FieldSet>
                                        </FieldCollection>
                                    </ModalContent>
                                    <ModalFooter>
                                        <List horizontal>
                                            <ListItem alignRight>
                                                <Button type={'button'} onClick={close}>Annuleren</Button>
                                            </ListItem>
                                            <ListItem alignRight>
                                                <Button type={'submit'}>Plaats bericht</Button>
                                            </ListItem>
                                        </List>
                                    </ModalFooter>
                                </ModalWindow>
                            </Form>
                        </ModalPortal>
                    )}
                />
                <ConversationUpdates />
            </ContentView>
        );
    }
}

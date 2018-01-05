import './PartupOnboardingTile.css';

import * as React from 'react';
import * as c from 'classnames';
import { Button } from 'components/Button/Button';
import { Row } from 'components/Row/Row';
import { Icon } from 'components/Icon/Icon';
import { Clickable } from 'components/Button/Clickable';
import { PartupDocument } from 'collections/Partups';
import { translate } from 'utils/translate';
import { Networks, NetworkDocument } from 'collections/Networks';
import { openPartupTakeModel, joinPartupAsSupporter } from 'utils/partupGlobals';
import { InviteDocument } from 'collections/Invites';
import { Meteor } from 'utils/Meteor';

interface Props {
    className?: string;
    partup: PartupDocument;
    invite?: InviteDocument|null;
    onActionTaken: () => void;
}

export class PartupOnboardingTile extends React.Component<Props> {

    private network: NetworkDocument;

    public componentWillMount() {
        const { partup } = this.props;
        this.network = Networks.findOneStatic({ _id: partup.network_id }) as NetworkDocument;
    }

    public render() {
        const { partup, invite } = this.props;

        return (
            <div className={this.getClassNames()}>
                <p dangerouslySetInnerHTML={{
                    __html: translate('pur-partup-start-onboarding_tile-text', { tribe: this.network.name }),
                }} />
                <Row className={`pur-PartupOnboardingTile__buttons`}>
                    <Button
                        leftChild={<Icon name={'person-plus'} />}
                        onClick={() => this.takeAction(openPartupTakeModel)}
                    >
                        {translate('pages-app-partup-become_partner')}
                    </Button>
                    <Button
                        leftChild={<Icon name={'megaphone'} />}
                        onClick={() => this.takeAction(joinPartupAsSupporter.bind(null, partup._id))}
                    >
                        {translate('pages-app-partup-supporters_join')}
                    </Button>
                    {invite && (
                        <Clickable className={`pur-PartupOnboardingTile__dismiss-button`} onClick={this.handleOnDismissClick}>
                            {translate('pur-partup-start-onboarding_tile-dismiss')}
                        </Clickable>
                    )}
                </Row>
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupOnboardingTile', {
            // 'pur-PartupOnboardingTile--modifier-class': boolean,
        }, className);
    }

    private handleOnDismissClick = () => {
        const { invite, onActionTaken } = this.props;

        if (invite) {
            Meteor.call('partups.dismiss_invite', invite._id, invite.partup_id);
            if (onActionTaken) onActionTaken();
        }
    }

    private takeAction = (action: Function) => action();
}

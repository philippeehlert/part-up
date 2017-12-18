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

interface Props {
    className?: string;
    partup: PartupDocument;
}

export class PartupOnboardingTile extends React.Component<Props> {

    private network: NetworkDocument;

    public componentWillMount() {
        const { partup } = this.props;
        this.network = Networks.findOneStatic({ _id: partup.network_id }) as NetworkDocument;
    }

    public render() {

        return (
            <div className={this.getClassNames()}>
                <p dangerouslySetInnerHTML={{
                    __html: translate('pur-partup-start-onboarding_tile-text', { tribe: this.network.name }),
                }} />
                <Row className={`pur-PartupOnboardingTile__buttons`}>
                    <Button leftChild={<Icon name={'person-plus'} />}>{translate('pages-app-partup-become_partner')}</Button>
                    <Button leftChild={<Icon name={'megaphone'} />}>{translate('pages-app-partup-supporters_join')}</Button>
                    <Clickable className={`pur-PartupOnboardingTile__dismiss-button`}>
                        {translate('pur-partup-start-onboarding_tile-dismiss')}
                    </Clickable>
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
}

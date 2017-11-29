import './ActivityTile.css';

import * as React from 'react';
import * as c from 'classnames';
import { Link } from 'components/Router/Link';
import { Icon } from 'components/Icon/Icon';
import { PopoverMenu } from 'components/PopoverMenu/PopoverMenu';
import { ParticipantAvatars } from 'components/ParticipantAvatars/ParticipantAvatars';

interface Props {
    className?: string
}

export class ActivityTile extends React.Component<Props, {}> {

    public render() {
        const menuLinks = [
            <Link key={1} leftChild={<Icon name={'pencil'} />}>Wijzig activiteit</Link>,
            <Link key={2} leftChild={<Icon name={'person-plus'} />}>Ik nodig iemand uit</Link>,
        ];

        return (
            <div className={this.getClassNames()}>
                <header className={`pur-ActivityTile__header`}>
                    <Link className={`pur-ActivityTile__title`}>Add introduction page to part-ups</Link>
                    <div className={`pur-ActivityTile__meta-info`}>
                        <time className={`pur-ActivityTile__timestamp`}>17 oktober 2017</time>
                        {` | `}
                        <Link className={`pur-ActivityTile__partup-link`}>Co-creating the Part-up development roadmap</Link>
                    </div>
                </header>
                <PopoverMenu className={`pur-ActivityTile__menu`} items={menuLinks}>
                    <Icon name={'menu'} />
                </PopoverMenu>
                <div className={`pur-ActivityTile__participants`}>
                    <ParticipantAvatars participants={[]} />
                </div>
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ActivityTile', {
            // 'pur-ActivityTile--modifier-class': boolean,
        }, className);
    }
}

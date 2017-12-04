import './ActivityTile.css';

import * as moment from 'moment';
import * as React from 'react';
import * as c from 'classnames';
import { Link } from 'components/Router/Link';
import { Icon } from 'components/Icon/Icon';
import { PopoverMenu } from 'components/PopoverMenu/PopoverMenu';
import { ParticipantAvatars } from 'components/ParticipantAvatars/ParticipantAvatars';
import { Activity } from 'collections/Activities';
import { Partups, Partup } from 'collections/Partups';
import { Contributions } from 'collections/Contributions';
import { User, Users } from 'collections/Users';

interface Props {
    className?: string
    activity: Activity
}

export class ActivityTile extends React.Component<Props, {}> {

    private partup: Partup | undefined;
    private contributers: User[] | undefined;

    public componentWillMount() {
        const { activity } = this.props;

        this.partup = Partups.findOneStatic(activity.partup_id);
        this.contributers = Contributions
            .findStatic()
            .map(({ upper_id }) => Users.findOne(upper_id))
            .reverse() as User[]; // Reverse the array because the row is reversed in css.
    }

    public render() {
        const { activity } = this.props;

        const menuLinks = [
            <Link key={1} leftChild={<Icon name={'pencil'} />}>Wijzig activiteit</Link>,
            <Link key={2} leftChild={<Icon name={'person-plus'} />}>Ik nodig iemand uit</Link>,
        ];

        return (
            <div className={this.getClassNames()}>
                <header className={`pur-ActivityTile__header`}>
                    <Link className={`pur-ActivityTile__title`}>{activity.name}</Link>
                    <div className={`pur-ActivityTile__meta-info`}>
                        <time className={`pur-ActivityTile__timestamp`}>{moment(activity.end_date).format('D MMMM YYYY')}</time>
                        {` | `}
                        <Link className={`pur-ActivityTile__partup-link`}>{this.partup && this.partup.name}</Link>
                    </div>
                </header>
                <PopoverMenu className={`pur-ActivityTile__menu`} items={menuLinks}>
                    <Icon name={'menu'} />
                </PopoverMenu>
                <div className={`pur-ActivityTile__participants`}>
                    <ParticipantAvatars participants={this.contributers ? this.contributers : []} />
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

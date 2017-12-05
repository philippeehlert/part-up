import './ActivityTile.css';

import * as moment from 'moment';
import * as React from 'react';
import * as c from 'classnames';
import { Link } from 'components/Router/Link';
import { Icon } from 'components/Icon/Icon';
import { PopoverMenu } from 'components/PopoverMenu/PopoverMenu';
import { ParticipantAvatars } from 'components/ParticipantAvatars/ParticipantAvatars';
import { ActivityDocument } from 'collections/Activities';
import { Partups, PartupDocument } from 'collections/Partups';
import { Contributions } from 'collections/Contributions';
import { UserDocument, Users } from 'collections/Users';

interface Props {
    className?: string
    activity: ActivityDocument
}

export class ActivityTile extends React.PureComponent<Props, {}> {

    private partup: PartupDocument | undefined;
    private contributers: UserDocument[] | undefined;

    public componentWillMount() {
        const { activity } = this.props;

        this.partup = Partups.findOneStatic({ _id: activity.partup_id });
        this.contributers = Contributions
            .findStatic()
            .map(({ upper_id }) => Users.findOne(upper_id))
            .reverse() as UserDocument[]; // Reverse the array because the row is reversed in css.
    }

    public render() {
        const { activity } = this.props;

        const partupSlug = Partups.getSlugById(activity.partup_id);

        const menuLinks = [
            <Link key={1} leftChild={<Icon name={'pencil'} />}>Wijzig activiteit</Link>,
            <Link key={2} leftChild={<Icon name={'person-plus'} />}>Ik nodig iemand uit</Link>,
        ];

        return (
            <div className={this.getClassNames()}>
                <header className={`pur-ActivityTile__header`}>
                    <Link
                        to={`/partups/${partupSlug}/updates/${activity._id}`}
                        target={`_partup`}
                        className={`pur-ActivityTile__title`}
                    >
                        {activity.name}
                    </Link>
                    <div className={`pur-ActivityTile__meta-info`}>
                        <time className={`pur-ActivityTile__timestamp`}>{moment(activity.end_date).format('D MMMM YYYY')}</time>
                        {` | `}
                        <Link
                            to={`/partups/${partupSlug}`}
                            target={`_partup`}
                            className={`pur-ActivityTile__partup-link`}
                        >
                            {this.partup && this.partup.name}
                        </Link>
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

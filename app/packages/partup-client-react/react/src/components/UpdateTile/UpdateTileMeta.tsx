import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';
import * as moment from 'moment';
import './UpdateTileMeta.css';

import { Link } from '../Router';

import { UserAvatar } from '../';

import { User } from 'types/User';

interface Props {
    className?: string;
    postedBy: User|any;
    postedAt: Date|string;
}

export default class UpdateTileMeta extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileMeta', className, {

        });
    }

    render() {
        const { postedBy, postedAt } = this.props;

        return (
            <div className={this.getClassNames()}>
                <UserAvatar user={postedBy} className={`pur-UpdateTileMeta__author-avatar`} />
                <div className={`pur-UpdateTileMeta__pur-UpdateTileMeta__info`}>
                    <h4 className={`pur-UpdateTileMeta__created-info`}>
                        <Link to="#">{this.getProfileNameOrPartup(postedBy)}</Link> voegde een bericht toe
                    </h4>
                    <time
                        className={`pur-UpdateTileMeta__created-at`}
                        dateTime={postedAt.toString()}
                    >
                        { moment(postedAt).format('H:mm ddd MMMM YYYY') }
                    </time>
                </div>
            </div>
        );
    }

    private getProfileNameOrPartup(postee: User|any) {
        if (postee.profile) {
            return get(postee, 'profile.normalized_name') || get(postee, 'profile.name');
        }

        return postee.name;
    }
}

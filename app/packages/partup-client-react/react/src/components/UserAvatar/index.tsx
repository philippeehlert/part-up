import * as React from 'react';
import * as c from 'classnames';
import { findOne, getUrl } from 'collections/Images';
import { get } from 'lodash';

import './UserAvatar.css';

import { User } from 'types/User';

interface Props {
    user?: User;
    className?: string;
    small?: boolean;
}

export default class UserAvatar extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className, small } = this.props;

        return c('pur-UserAvatar', className, {
            'pur-UserAvatar--small': small,
        });
    }

    render() {
        const { user } = this.props;

        const image = findOne({_id: get(user, 'profile.image')});
        const imageUrl = getUrl(image, '360x360');

        return (
            <div className={this.getClassNames()}>
                <img src={imageUrl} alt={name} className={`pur-UserAvatar__image`} />
            </div>
        );
    }
}

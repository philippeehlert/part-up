import './UserAvatar.css';

import * as React from 'react';
import * as c from 'classnames';
import { findOne, getUrl, findOneStatic } from 'collections/Images';
import { get } from 'lodash';
import { User } from 'types/User';

interface Props {
    user?: User;
    userAvatarImageId?: string;
    className?: string;
    small?: boolean;
}

export class UserAvatar extends React.Component<Props, {}> {

    public render() {
        const { user, userAvatarImageId } = this.props;
        const imageId = get(user, 'profile.image') || userAvatarImageId;

        const image = findOne({ _id: imageId }) || findOneStatic(imageId);

        const imageUrl = getUrl(image, '360x360');

        return (
            <div className={this.getClassNames()}>
                <img src={imageUrl} className={`pur-UserAvatar__image`} />
            </div>
        );
    }

    private getClassNames = () => {
        const { className, small } = this.props;

        return c('pur-UserAvatar', className, {
            'pur-UserAvatar--small': small,
        });
    }
}

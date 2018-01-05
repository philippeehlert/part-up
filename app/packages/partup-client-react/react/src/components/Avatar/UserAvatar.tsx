import './UserAvatar.css';

import * as React from 'react';
import * as c from 'classnames';
import { Images } from 'collections/Images';
import { get } from 'lodash';
import { UserDocument } from 'collections/Users';

interface Props {
    user?: UserDocument;
    userAvatarImageId?: string;
    className?: string;
    small?: boolean;
    square?: boolean;
}

export class UserAvatar extends React.Component<Props, {}> {

    public render() {
        const { user, userAvatarImageId } = this.props;
        const imageId = get(user, 'profile.image') || userAvatarImageId;

        const image = Images.findOneAny({ _id: imageId });

        const imageUrl = Images.getUrl(image, '360x360');

        return (
            <div className={this.getClassNames()}>
                <img src={imageUrl} className={`pur-UserAvatar__image`} />
            </div>
        );
    }

    private getClassNames = () => {
        const { className, small, square } = this.props;

        return c('pur-UserAvatar', className, {
            'pur-UserAvatar--small': small,
            'pur-UserAvatar--square': square,
        });
    }
}

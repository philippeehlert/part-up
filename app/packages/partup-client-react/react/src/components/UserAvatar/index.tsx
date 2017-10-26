import * as React from 'react';
import * as c from 'classnames';
import * as Images from 'collections/Images';
import { get } from 'lodash';

import './UserAvatar.css';

import { User } from 'types/User';

interface Props {
    user?: User;
    className?: string;
}

export default class UserAvatar extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-UserAvatar', className, {

        });
    }

    render() {
        const { user } = this.props;
        const image = Images.findOne({_id: get(user, 'profile.image')});
        const imageUrl = Images.getUrl(image, '360x360');

        console.log(imageUrl);

        return (
            <div className={this.getClassNames()}>
                <img src={imageUrl} alt={name} className={`pur-UserAvatar__image`} />
            </div>
        );
    }
}

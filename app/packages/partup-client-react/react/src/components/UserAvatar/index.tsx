import * as React from 'react';
import * as c from 'classnames';
import './UserAvatar.css';

import { User } from 'types/User';

interface Props {
    user?: User;
    className?: string;
}

export default class UserAvatar extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pug-UserAvatar', className, {

        });
    }

    render() {
        const { user } = this.props;

        const image = !user || !user.profile.image ? 'https://s3-eu-west-1.amazonaws.com/partup-production/80x80/images/rMRdjjrbX7oJboxpX-Profielfoto3.png' : user.profile.image as string;

        return (
            <div className={this.getClassNames()}>
                <img src={image} alt={name} className={`pug-UserAvatar__image`} />
            </div>
        );
    }
}

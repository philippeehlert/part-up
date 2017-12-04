import './ParticipantAvatars.css';

import * as React from 'react';
import * as c from 'classnames';
import { UserAvatar } from 'components/Avatar/UserAvatar';
import { UserDocument } from 'collections/Users';

interface Props {
    className?: string
    participants: UserDocument[]
}

export class ParticipantAvatars extends React.Component<Props, {}> {

    public render() {
        const {
            participants,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                {participants.map(participant => (
                    <UserAvatar key={participant._id} user={participant} />
                ))}
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ParticipantAvatars', {
            // 'pur-ParticipantAvatars--modifier-class': boolean,
        }, className);
    }
}

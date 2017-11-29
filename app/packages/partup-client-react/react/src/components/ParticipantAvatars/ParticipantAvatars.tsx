import './ParticipantAvatars.css';

import * as React from 'react';
import * as c from 'classnames';
import { User } from 'types/User';
import { UserAvatar } from 'components/Avatar/UserAvatar';

interface Props {
    className?: string
    participants: User[]
}

export class ParticipantAvatars extends React.Component<Props, {}> {

    public render() {
        const {
            participants,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                {participants.map(participant => (
                    <UserAvatar user={participant} />
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

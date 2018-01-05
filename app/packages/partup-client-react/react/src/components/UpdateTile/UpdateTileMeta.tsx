import './UpdateTileMeta.css';

import * as React from 'react';
import * as c from 'classnames';
import * as moment from 'moment';
import { ConversationUpdateDocument } from 'collections/Updates';
import { SystemAvatar } from 'components/Avatar/SystemAvatar';
import { UserAvatar } from 'components/Avatar/UserAvatar';
import { Users, UserDocument } from 'collections/Users';
import { Partups, PartupDocument } from 'collections/Partups';
import { PartupAvatar } from 'components/Avatar/PartupAvatar';

interface Props {
    className?: string;
    update: ConversationUpdateDocument;
}

export class UpdateTileMeta extends React.Component<Props, {}> {

    public render() {
        const { update, children } = this.props;
        const { created_at } = update;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileMeta__author-avatar`}>
                    {this.getAvatar()}
                </div>
                <div className={`pur-UpdateTileMeta__pur-UpdateTileMeta__info`}>
                    <h4 className={`pur-UpdateTileMeta__created-info`}>
                        { children }
                    </h4>
                    <time
                        className={`pur-UpdateTileMeta__created-at`}
                        dateTime={created_at.toString()}
                    >
                        { moment(created_at).format('H:mm ddd MMMM YYYY') }
                    </time>
                </div>
            </div>
        );
    }

    private getAvatar() {
        const { update } = this.props;

        if (update.system) {
            return <SystemAvatar />;
        }

        if (update.upper_id) {
            const user = (Users.findOneAny({ _id: update.upper_id }) as UserDocument);
            return <UserAvatar user={user} />;
        }

        const partup = Partups.findOneAny({ _id: update.partup_id }) as PartupDocument;

        return <PartupAvatar partup={partup} />;
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileMeta', className, {

        });
    }
}

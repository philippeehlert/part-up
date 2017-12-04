import './UpdateTileMeta.css';

import * as React from 'react';
import * as c from 'classnames';
import * as moment from 'moment';
import { ConversationUpdateDocument } from 'collections/Updates';
import { SystemAvatar } from 'components/Avatar/SystemAvatar';
import { UserAvatar } from 'components/Avatar/UserAvatar';

interface Props {
    className?: string;
    update: ConversationUpdateDocument;
}

export class UpdateTileMeta extends React.Component<Props, {}> {

    public render() {
        const { update, children } = this.props;
        const { created_at, upper } = update;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileMeta__author-avatar`}>
                    { update.system && (
                        <SystemAvatar />
                     ) }
                     { !update.system && (
                        <UserAvatar user={upper} />
                     ) }
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

    private getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileMeta', className, {

        });
    }
}

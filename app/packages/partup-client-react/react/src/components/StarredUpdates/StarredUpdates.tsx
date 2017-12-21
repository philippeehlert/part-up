import './StarredUpdates.css';

import * as React from 'react';
import * as c from 'classnames';
import { ConversationUpdateDocument } from 'collections/Updates';
import { UpdateTile } from 'components/UpdateTile/UpdateTile';

interface Props {
    className?: string;
    updates: ConversationUpdateDocument[];
}

interface State {}

export class StarredUpdates extends React.Component<Props, State> {

    public render() {
        const { updates } = this.props;

        return (
            <div className={this.getClassNames()}>
                <h4 className={`pur-StarredUpdates__title`}>Starred updates</h4>

                {updates.length ? (
                    updates.map(update => <UpdateTile
                        key={update._id}
                        hideCommentBox
                        isStarred
                        update={update}
                    />)
                ) : (
                    <p>Er zijn nog geen starred updates.</p>
                )}
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-StarredUpdates', {
            // 'pur-StarredUpdates--modifier-class': boolean,
        }, className);
    }
}

import './SystemComment.css';

import * as React from 'react';
import * as c from 'classnames';
import * as moment from 'moment';
import { translate } from 'utils/translate';

import { Comment as CommentType } from 'collections/Updates';

interface Props {
    comment: CommentType;
    className?: string;
}

export class SystemComment extends React.Component<Props, {}> {

    public render() {
        const { comment } = this.props;

        return (
            <div className={this.getClassNames()}>
                <p>
                    <strong
                        data-hovercontainer="HoverContainer_upper"
                        data-hovercontainer-context={comment.creator._id}>
                        {comment.creator.name}
                    </strong>
                    {` `}
                    { translate(`comment-field-content-${comment.content}`) }
                    {` `}
                    <time className={`pur-SystemComment__postedAt`}>
                        { moment(comment.created_at).format('ddd, MMMM [om] h:mm') }
                    </time>
                </p>
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-SystemComment', className, {

        });
    }
}

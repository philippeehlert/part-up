import * as React from 'react';
import * as c from 'classnames';
import './Comment.css';

import * as moment from 'moment';

import { UserAvatar } from 'components';

import { Comment as CommentType } from 'collections/Updates';

interface Props {
    comment: CommentType;
    className?: string;
}

export default class Comment extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-Comment', className, {

        });
    }

    render() {
        const { comment } = this.props;

        return (
            <div className={this.getClassNames()}>
                <UserAvatar user={undefined} className={`pur-Comment__avatar`} />
                <div className={`pur-Comment__content`}>
                    <p>
                        <strong>{comment.creator.name}</strong>
                        {` `}
                        <span>{comment.content}</span>
                    </p>
                    <time className={`pur-Comment__postedAt`}>
                        { moment(comment.created_at).format('ddd, MMMM [om] h:mm') }
                    </time>
                </div>
            </div>
        );
    }
}

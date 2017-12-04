import './Comment.css';

import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';
import * as moment from 'moment';

import { UpdateCommentSubDocument as CommentType } from 'collections/Updates';
import { decode } from 'utils/mentions';
import { UserAvatar } from 'components/Avatar/UserAvatar';
import { HTMLText } from 'components/HTMLText/HTMLText';

interface Props {
    comment: CommentType;
    className?: string;
    prefix?: string;
}

export class Comment extends React.Component<Props, {}> {

    public render() {
        const { comment, prefix } = this.props;

        return (
            <div className={this.getClassNames()}>
                <UserAvatar
                    userAvatarImageId={get(comment, 'creator.image')}
                    className={`pur-Comment__avatar`}
                    small
                    square
                />
                <div className={`pur-Comment__content`}>
                    <p>
                        <strong
                            data-hovercontainer="HoverContainer_upper"
                            data-hovercontainer-context={comment.creator._id}>
                            {comment.creator.name}
                        </strong>
                        { prefix && (
                            <span>{` `}{prefix}</span>
                        ) }
                        {` `}
                        <HTMLText html={decode(comment.content)} wrapComponent={'span'}/>
                    </p>
                    <time className={`pur-Comment__postedAt`}>
                        { moment(comment.created_at).format('ddd, MMMM [om] h:mm') }
                    </time>
                </div>
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Comment', className, {

        });
    }
}

import './Comment.css';

import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';
import * as moment from 'moment';

import { UpdateCommentSubDocument as CommentType } from 'collections/Updates';
import { UserAvatar } from 'components/Avatar/UserAvatar';
import { CommentText } from 'components/TextRenderer/CommentText';
import { CommentBox } from 'components/Comment/CommentBox';
import { Users } from 'collections/Users';

interface Props {
    comment: CommentType;
    className?: string;
    prefix?: string;
    onClick?: Function;
    onSubmit?: Function;
    onBlur?: Function;
}

interface State {
    editing: boolean;
}

export class Comment extends React.Component<Props, State> {

    public state: State = {
        editing: false,
    };

    public render() {
        const { comment, prefix } = this.props;
        const { editing } = this.state;

        return (
            <div className={this.getClassNames()}>
                <UserAvatar
                    userAvatarImageId={get(comment, 'creator.image')}
                    className={`pur-Comment__avatar`}
                    small
                    square
                />
                { !editing && (
                    <div
                        className={`pur-Comment__content`}
                        onClick={this.onClick}
                        >
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
                            <CommentText
                                text={comment.content} />
                        </p>
                        <time className={`pur-Comment__postedAt`}>
                            { moment(comment.created_at).format('ddd, MMMM [om] h:mm') }
                        </time>
                    </div>
                ) }
                { editing && (
                    <div className={`pur-Comment__content`}>
                        <CommentBox
                            autoFocus
                            onSubmit={this.onSubmit}
                            onBlur={this.onBlur}
                            defaultValue={comment.content}
                            />
                    </div>
                ) }
            </div>
        );
    }

    private onClick = (event: React.SyntheticEvent<any>): void => {
        const { onClick, comment } = this.props;
        const { editing } = this.state;

        const user = Users.findLoggedInUser();

        if (user && comment.creator._id === user._id) {
            this.setState({
                editing: !editing,
            });
        }

        if (onClick) onClick(event);
    }

    private onSubmit = (event: React.SyntheticEvent<any>, fields: Object) => {
        const { onSubmit, comment } = this.props;

        this.setState({
            editing: false,
        });

        if (onSubmit) onSubmit(event, { commentId: comment._id, ...fields });
    }

    private onBlur = (event: React.SyntheticEvent<any>) => {
        const { onBlur } = this.props;

        this.setState({
            editing: false,
        });

        if (onBlur) onBlur(event);
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Comment', className, {

        });
    }
}

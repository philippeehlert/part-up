import './UpdateTileComments.css';

import * as React from 'react';
import * as c from 'classnames';
import { takeRight } from 'lodash';
import { Updates } from 'collections/Updates';
import { Comment } from 'components/Comment/Comment';
import { Clickable } from 'components/Button/Clickable';
import { CommentBox } from 'components/Comment/CommentBox';
import { Meteor } from 'utils/Meteor';

interface Props {
    className?: string;
    collapsedMax?: number;
    update: any;
    user: any;
}

interface State {
    showAllComments: boolean;
    showCommentBox: boolean;
}

export class UpdateTileComments extends React.Component<Props, State> {

    public static defaultProps: Partial<Props> = {
        collapsedMax: 2,
    };

    public state: State = {
        showAllComments: false,
        showCommentBox: true,
    };

    private commentBoxComponent: CommentBox|null = null;

    public render() {
        const { user, update } = this.props;
        const { comments_count = 0 } = Updates.findOne({ _id: update._id }) || {};
        const { showCommentBox } = this.state;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileComments__controls`}>
                    <Clickable
                        className={`pur-UpdateTileComments__control-reactions`}
                        onClick={this.toggleAllComments}
                    >
                        { comments_count } reactie
                    </Clickable>
                    {` • `}
                    <Clickable
                        className={`pur-UpdateTileComments__control-respond-link`}
                        onClick={this.handleCommentClick}
                    >
                        Reageren
                    </Clickable>
                </div>

                { comments_count > 0 && this.renderComments() }

                {showCommentBox && (
                    <CommentBox
                        poster={user}
                        ref={el => this.commentBoxComponent = el}
                        onSubmit={this.submitComment}
                        className={`put-UpdateTileComments__comment-box`}
                    />
                )}
            </div>
        );
    }

    private renderComments() {
        const { update, collapsedMax } = this.props;
        const { comments = [], comments_count = 0 } = Updates.findOne({ _id: update._id }) || {};
        const { showAllComments } = this.state;

        const amountOfCommentToShow = showAllComments ? comments_count : collapsedMax;
        const commentComponents = comments
            .filter(({ type }) => type !== 'system')
            .map((comment: any) => {
                if (comment.type === 'motivation') {
                    return <Comment prefix={`'s motivation is:`} key={comment._id} comment={comment} />;
                }

                return <Comment key={comment._id} comment={comment} />;
            });

        return (
            <div className={`pur-UpdateTileComments__container`}>
                { takeRight(commentComponents, amountOfCommentToShow) }
            </div>

        );
    }

    private handleCommentClick = () => {
        const { showCommentBox } = this.state;

        if (showCommentBox) {
            if (this.commentBoxComponent) this.commentBoxComponent.focus();
        } else {
            this.setState({
                showCommentBox: true,
            }, () => {
                if (this.commentBoxComponent) this.commentBoxComponent.focus();
            });
        }
    }

    private toggleAllComments = () => {
        this.setState({
            showAllComments: !this.state.showAllComments,
        });
    }

    private submitComment = (e: Event, { comment }: {comment: string}) => {
        e.preventDefault();
        const { update } = this.props;

        Meteor.call('updates.comments.insert', update._id, {
            content: comment.trim(),
        });
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileComments', className, {

        });
    }
}

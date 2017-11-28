import './UpdateTileComments.css';

import * as React from 'react';
import * as c from 'classnames';
import { takeRight } from 'lodash';
import { Comment as CommentType } from 'collections/Updates';
import { Comment } from 'components/Comment/Comment';
import { Clickable } from 'components/Button/Clickable';
import { CommentBox } from 'components/Comment/CommentBox';
import { Meteor } from 'utils/Meteor';

interface Props {
    comments: Array<CommentType>;
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
        showCommentBox: this.props.comments.length > 0 ? true : false,
    };

    private commentBoxComponent: CommentBox|null = null;

    public render() {
        const { comments, user } = this.props;
        const count = comments.length;
        const { showCommentBox } = this.state;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileComments__controls`}>
                    <span className={`pur-UpdateTileComments__controls__reactions`} onClick={this.toggleAllComments}>
                        { count } reactie{count !== 1 && 's'}
                    </span>
                    {` • `}
                    <Clickable
                        className={`pur-UpdateTileComments__controls__respond-link`}
                        onClick={this.handleCommentClick}
                    >
                        Reageren
                    </Clickable>
                </div>

                { comments.length > 0 && this.renderComments() }

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
        const { comments, collapsedMax } = this.props;
        const { showAllComments } = this.state;

        const amountOfCommentToShow = showAllComments ? comments.length : collapsedMax;
        const commentComponents = comments.map((comment) => {
            if (comment.type === 'motivation') {
                return <Comment prefix={`'s motivation is:`} key={comment._id} comment={comment} />;
            }

            return <Comment key={comment._id} comment={comment} />;
        });

        return (
            <div className={`pur-UpdateTileComments__container`}>
                { takeRight(commentComponents, amountOfCommentToShow) }

                { !showAllComments && comments.length > 2 && (
                    <Clickable className={`pur-UpdateTileComments__more-commments`} onClick={this.toggleAllComments}>
                        Laat alle reacties zien
                    </Clickable>
                ) }

                { showAllComments && comments.length > 2 && (
                    <Clickable className={`pur-UpdateTileComments__more-commments`} onClick={this.toggleAllComments}>
                        Verberg reacties
                    </Clickable>
                ) }
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

import './UpdateTileComments.css';

import * as React from 'react';
import * as c from 'classnames';
import { take } from 'lodash';
import { Comment as CommentType } from 'collections/Updates';
import { Comment } from 'components/Comment/Comment';
import { Clickable } from 'components/Button/Clickable';
import { CommentBox } from 'components/Comment/CommentBox';

interface Props {
    comments: Array<CommentType>;
    className?: string;
    collapsedMax?: number;
    // onRespondClick?: Function;
    update: any;
    user: any
    onCommentSubmitted: (comment: string, user: any) => void
}

interface State {
    showAllComments: boolean;
}

export class UpdateTileComments extends React.Component<Props, State> {

    public static defaultProps: Partial<Props> = {
        collapsedMax: 2,
    };

    public state: State = {
        showAllComments: false,
    };

    private commentBoxComponent: CommentBox|null = null;

    public render() {
        const { comments, user } = this.props;
        const count = comments.length;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileComments__controls`}>
                    <span className={`pur-UpdateTileComments__controls__reactions`} onClick={this.toggleAllComments}>
                        { count } reactie{count !== 1 && 's'}
                    </span>
                    {` • `}
                    <Clickable
                        className={`pur-UpdateTileComments__controls__respond-link`}
                        onClick={() => this.commentBoxComponent && this.commentBoxComponent.focus()}
                    >
                        Reageren
                    </Clickable>
                </div>

                { comments.length > 0 && this.renderComments() }

                <CommentBox
                    poster={user}
                    ref={el => this.commentBoxComponent = el}
                    onSubmit={(e: any, fields: any) => this.props.onCommentSubmitted(fields.comment, user)}
                    className={`put-UpdateTileComments__comment-box`}
                />
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
                { take(commentComponents, amountOfCommentToShow) }

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

    private toggleAllComments = () => {
        this.setState({
            showAllComments: !this.state.showAllComments,
        });
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileComments', className, {

        });
    }

    // private onRespondClick = (event: React.SyntheticEvent<any>) => {
    //     const { onRespondClick } = this.props;

    //     if (onRespondClick) onRespondClick(event);
    // }
}

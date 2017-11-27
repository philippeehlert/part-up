import './UpdateTileComments.css';

import * as React from 'react';
import * as c from 'classnames';
import { take } from 'lodash';
import { Comment as CommentType } from 'collections/Updates';
import { Comment } from 'components/Comment/Comment';
import { Link } from 'components/Router/Link';
import { Clickable } from 'components/Button/Clickable';

interface Props {
    comments: Array<CommentType>;
    className?: string;
    collapsedMax?: number;
    // onRespondClick?: Function;
    update: any;
}

interface State {
    commentBoxEnabled: boolean;
    showAllComments: boolean;
}

export class UpdateTileComments extends React.Component<Props, State> {

    public static defaultProps: Partial<Props> = {
        collapsedMax: 2,
    };

    public state: State = {
        commentBoxEnabled: false,
        showAllComments: false,
    };

    public render() {
        const { comments, update } = this.props;
        // const { commentBoxEnabled } = this.state;
        const count = comments.length;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileComments__controls`}>
                    <span className={`pur-UpdateTileComments__controls__reactions`} onClick={this.toggleAllComments}>
                        { count } reactie{count !== 1 && 's'}
                    </span>
                    {` • `}
                    <Link
                        className={`pur-UpdateTileComments__controls__respond-link`}
                        target={'_partup'}
                        to={`/partups/${update.partup.slug}/updates/${update._id}`}
                    >
                        Reageren
                    </Link>
                </div>

                { comments.length > 0 && this.renderComments() }

                { /* { commentBoxEnabled && (
                    <div className={`put-UpdateTileComments__comment-box`}>
                        <input type="text" />
                    </div>
                ) } */ }
            </div>
        );
    }

    private renderComments() {
        const { comments, collapsedMax } = this.props;
        const { showAllComments } = this.state;

        const updateComments = comments.filter(({ type }) => type !== 'system');

        const amountOfCommentToShow = showAllComments ? updateComments.length : collapsedMax;

        const commentComponents = updateComments.map((comment) => {
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

    // private toggleCommentBox = () => {
    //     this.setState({
    //         commentBoxEnabled: !this.state.commentBoxEnabled,
    //     });
    // }

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

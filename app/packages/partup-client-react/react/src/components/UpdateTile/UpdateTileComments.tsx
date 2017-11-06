
import * as React from 'react';
import * as c from 'classnames';
import './UpdateTileComments.css';
import { take } from 'lodash';

import { Comment as CommentType } from 'collections/Updates';

import Comment, { SystemComment } from 'components/Comment';
import { Link } from 'components/Router';

interface Props {
    comments: Array<CommentType>;
    className?: string;
    collapsedMax?: number;
    onRespondClick?: Function;
    update: any;
}

interface State {
    commentBoxEnabled: boolean;
}

export default class UpdateTileComments extends React.Component<Props, State> {

    static defaultProps = {
        collapsedMax: 2,
    };

    public state: State = {
        commentBoxEnabled: false,
    };

    getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileComments', className, {

        });
    }

    onRespondClick = (event: React.SyntheticEvent<any>) => {
        const { onRespondClick } = this.props;
    
        if (onRespondClick) onRespondClick(event);
    }

    render() {
        const { comments, update } = this.props;
        // const { commentBoxEnabled } = this.state;
        const count = comments.length;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileComments__controls`}>
                    <span className={`pur-UpdateTileComments__controls__reactions`}>
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

        const commentComponents = comments.map((comment) => {

            if (comment.type === 'system') {
                return <SystemComment key={comment._id} comment={comment} />;
            }
            if (comment.type === 'motivation') {
                return <Comment prefix={`'s motivation is:`} key={comment._id} comment={comment} />;
            }
            return <Comment key={comment._id} comment={comment} />;
        });

        return (
            <div className={`pur-UpdateTileComments__container`}>
                { take(commentComponents, collapsedMax) }
            </div>

        );
    }

    // private toggleCommentBox = () => {
    //     this.setState({
    //         commentBoxEnabled: !this.state.commentBoxEnabled,
    //     });
    // }
}

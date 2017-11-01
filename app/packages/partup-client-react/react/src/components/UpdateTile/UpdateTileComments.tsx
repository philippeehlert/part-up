
import * as React from 'react';
import * as c from 'classnames';
import './UpdateTileComments.css';

import { Comment as CommentType } from 'collections/Updates';

import { Comment } from 'components';
import { Clickable } from 'components/Button';

interface Props {
    comments: Array<CommentType>;
    className?: string;
}

interface State {
    commentBoxEnabled: boolean;
}

export default class UpdateTileComments extends React.Component<Props, State> {

    public state: State = {
        commentBoxEnabled: false,
    };

    getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileComments', className, {

        });
    }

    render() {
        const { comments } = this.props;
        const { commentBoxEnabled } = this.state;
        const count = comments.length;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileComments__controls`}>
                    <span className={`pur-UpdateTileComments__controls__reactions`}>
                        { count } reactie{count !== 1 && 's'}
                    </span>
                    {` • `}
                    <Clickable
                        className={`pur-UpdateTileComments__controls__respond-link`}
                        onClick={this.toggleCommentBox}
                    >
                        Reageren
                    </Clickable>
                </div>

                { comments.length > 0 && (
                    <div className={`pur-UpdateTileComments__container`}>
                        { comments.map(comment => (<Comment key={comment._id} comment={comment} />)) }
                    </div>
                ) }

                { commentBoxEnabled && (
                    <div className={`put-UpdateTileComments__comment-box`}>
                        <input type="text" />
                    </div>
                ) }
            </div>
        );
    }

    private toggleCommentBox = () => {
        this.setState({
            commentBoxEnabled: !this.state.commentBoxEnabled,
        });
    }
}

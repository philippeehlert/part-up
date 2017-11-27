import * as React from 'react';
import * as c from 'classnames';
import './SystemComment.css';

import * as moment from 'moment';

// import { HTMLText } from 'components';

import { Comment as CommentType } from 'collections/Updates';

// import { decode } from 'utils/mentions';

import translate from 'utils/translate';

interface Props {
    comment: CommentType;
    className?: string;
}

export class SystemComment extends React.Component<Props, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-SystemComment', className, {

        });
    }

    render() {
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
}

import './PartupCommentAdded.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class PartupCommentAdded extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_comment_added` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupCommentAdded', className, {

        });
    }
}

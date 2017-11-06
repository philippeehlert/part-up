
import * as React from 'react';
import * as c from 'classnames';
import './ContributionCommentAdded.css';

interface Props {
    className?: string;
}

export default class ContributionCommentAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionCommentAdded', className, {

        });
    }

    render() {

        return (
            <div className={this.getClassNames()}>
                { `contribution_comment_added` }
            </div>
        );
    }
}

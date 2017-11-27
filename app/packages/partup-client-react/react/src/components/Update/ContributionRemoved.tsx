
import * as React from 'react';
import * as c from 'classnames';
import './ContributionRemoved.css';

interface Props {
    className?: string;
}

export class ContributionRemoved extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionRemoved', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `contribution_removed` }
            </div>
        );
    }
}

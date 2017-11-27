import './ContributionRemoved.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class ContributionRemoved extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `contribution_removed` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionRemoved', className, {

        });
    }
}

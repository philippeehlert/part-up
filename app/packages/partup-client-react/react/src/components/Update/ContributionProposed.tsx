import './ContributionProposed.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class ContributionProposed extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `contribution_proposed` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionProposed', className, {

        });
    }
}

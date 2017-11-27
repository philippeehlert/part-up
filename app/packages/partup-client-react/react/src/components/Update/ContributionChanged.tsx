import './ContributionChanged.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class ContributionChanged extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `contribution_changed` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionChanged', className, {

        });
    }
}


import * as React from 'react';
import * as c from 'classnames';
import './ContributionProposed.css';

interface Props {
    className?: string;
}

export default class ContributionProposed extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionProposed', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `contribution_proposed` }
            </div>
        );
    }
}


import * as React from 'react';
import * as c from 'classnames';
import './ContributionAdded.css';

interface Props {
    className?: string;
}

export default class ContributionAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionAdded', className, {

        });
    }

    render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { children }
            </div>
        );
    }
}



import * as React from 'react';
import * as c from 'classnames';
import './ContributionAccepted.css';

interface Props {
    className?: string;
}

export default class ContributionAccepted extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionAccepted', className, {

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


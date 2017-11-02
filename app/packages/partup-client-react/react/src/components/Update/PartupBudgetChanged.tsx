
import * as React from 'react';
import * as c from 'classnames';
import './PartupBudgetChanged.css';

interface Props {
    className?: string;
}

export default class PartupBudgetChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupBudgetChanged', className, {

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


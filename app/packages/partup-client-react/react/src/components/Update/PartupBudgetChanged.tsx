
import * as React from 'react';
import * as c from 'classnames';
import './PartupBudgetChanged.css';

interface Props {
    className?: string;
}

export class PartupBudgetChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupBudgetChanged', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_budget_changed` }
            </div>
        );
    }
}

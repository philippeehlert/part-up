import './FilteredListControls.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class FilteredListControls extends React.Component<Props, {}> {

    public render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { children }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-FilteredListControls', className, {

        });
    }
}

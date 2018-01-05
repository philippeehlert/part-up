import './SystemSupporterRemoved.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class SystemSupporterRemoved extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `system_supporter_removed` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-SystemSupporterRemoved', className, {

        });
    }
}

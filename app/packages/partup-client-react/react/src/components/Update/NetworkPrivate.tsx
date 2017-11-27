import './NetworkPrivate.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class NetworkPrivate extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `network_private` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-NetworkPrivate', className, {

        });
    }
}

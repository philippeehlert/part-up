import './NetworkPublic.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class NetworkPublic extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `network_public` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-NetworkPublic', className, {

        });
    }
}

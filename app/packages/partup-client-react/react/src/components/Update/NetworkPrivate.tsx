
import * as React from 'react';
import * as c from 'classnames';
import './NetworkPrivate.css';

interface Props {
    className?: string;
}

export default class NetworkPrivate extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-NetworkPrivate', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `network_private` }
            </div>
        );
    }
}

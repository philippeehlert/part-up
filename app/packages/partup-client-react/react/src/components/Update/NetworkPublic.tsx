
import * as React from 'react';
import * as c from 'classnames';
import './NetworkPublic.css';

interface Props {
    className?: string;
}

export default class NetworkPublic extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-NetworkPublic', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `network_public` }
            </div>
        );
    }
}

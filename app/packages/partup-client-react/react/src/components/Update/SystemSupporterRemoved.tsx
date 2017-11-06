
import * as React from 'react';
import * as c from 'classnames';
import './SystemSupporterRemoved.css';

interface Props {
    className?: string;
}

export default class SystemSupporterRemoved extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-SystemSupporterRemoved', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `system_supporter_removed` }
            </div>
        );
    }
}

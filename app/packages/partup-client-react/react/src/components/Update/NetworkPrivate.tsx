
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


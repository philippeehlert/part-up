
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

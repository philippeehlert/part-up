
import * as React from 'react';
import * as c from 'classnames';
import './PartupActivityRemoved.css';

interface Props {
    className?: string;
}

export default class PartupActivityRemoved extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityRemoved', className, {

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

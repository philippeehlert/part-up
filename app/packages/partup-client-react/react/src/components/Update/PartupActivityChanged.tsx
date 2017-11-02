
import * as React from 'react';
import * as c from 'classnames';
import './PartupActivityChanged.css';

interface Props {
    className?: string;
}

export default class PartupActivityChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityChanged', className, {

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


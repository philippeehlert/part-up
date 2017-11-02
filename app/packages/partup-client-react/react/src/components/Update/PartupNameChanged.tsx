
import * as React from 'react';
import * as c from 'classnames';
import './PartupNameChanged.css';

interface Props {
    className?: string;
}

export default class PartupNameChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupNameChanged', className, {

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


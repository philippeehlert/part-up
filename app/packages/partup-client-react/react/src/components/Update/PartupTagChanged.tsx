
import * as React from 'react';
import * as c from 'classnames';
import './PartupTagChanged.css';

interface Props {
    className?: string;
}

export default class PartupTagChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupTagChanged', className, {

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


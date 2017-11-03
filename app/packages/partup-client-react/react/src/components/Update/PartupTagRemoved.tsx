
import * as React from 'react';
import * as c from 'classnames';
import './PartupTagRemoved.css';

interface Props {
    className?: string;
}

export default class PartupTagRemoved extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupTagRemoved', className, {

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

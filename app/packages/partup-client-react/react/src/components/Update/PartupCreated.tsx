
import * as React from 'react';
import * as c from 'classnames';
import './PartupCreated.css';

interface Props {
    className?: string;
}

export default class PartupCreated extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupCreated', className, {

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



import * as React from 'react';
import * as c from 'classnames';
import './PartupTagAdded.css';

interface Props {
    className?: string;
}

export default class PartupTagAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupTagAdded', className, {

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


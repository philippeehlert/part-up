
import * as React from 'react';
import * as c from 'classnames';
import './PartupActivityArchived.css';

interface Props {
    className?: string;
}

export default class PartupActivityArchived extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityArchived', className, {

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


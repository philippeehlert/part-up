
import * as React from 'react';
import * as c from 'classnames';
import './PartupActivityUnarchived.css';

interface Props {
    className?: string;
}

export default class PartupActivityUnarchived extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityUnarchived', className, {

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


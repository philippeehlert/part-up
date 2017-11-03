
import * as React from 'react';
import * as c from 'classnames';
import './PartupUnarchived.css';

interface Props {
    className?: string;
}

export default class PartupUnarchived extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupUnarchived', className, {

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

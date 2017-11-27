import * as React from 'react';
import * as c from 'classnames';
import './Counter.css';

interface Props {
    className?: string;
    count: number;
}

export class Counter extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-Counter', className, {

        });
    }

    render() {
        const {
            count,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { count }
            </div>
        );
    }
}

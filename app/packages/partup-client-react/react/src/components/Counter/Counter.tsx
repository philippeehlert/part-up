import './Counter.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    count: number;
}

export class Counter extends React.Component<Props, {}> {

    public render() {
        const {
            count,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { count }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Counter', className, {

        });
    }
}

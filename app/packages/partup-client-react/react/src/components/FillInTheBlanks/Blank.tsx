import './Blank.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    label: string;
    className?: string;
}

export class Blank extends React.Component<Props, {}> {

    public render() {
        const {
            label,
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-Blank__label`}>{ label }</div>
                { children }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Blank', className, {

        });
    }
}

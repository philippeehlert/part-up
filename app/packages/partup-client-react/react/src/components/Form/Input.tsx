import './Input.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    type: string;
    name: string;
}

export class Input extends React.Component<Props, {}> {

    public render() {
        const { type, name } = this.props;

        return (
            <input type={type} name={name} className={this.getClassNames()} />
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Input', className, {

        });
    }
}

import './Clickable.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    onClick: Function;
}

export class Clickable extends React.Component<Props, {}> {

    public render() {
        const { children } = this.props;

        return (
            <button type="button" className={this.getClassNames()} onClick={this.onClick}>
                {children}
            </button>
        );
    }

    private onClick = (event: React.SyntheticEvent<any>) => {
        const { onClick } = this.props;

        if (onClick) onClick(event);
    }

    private getClassNames = () => {
        const { className } = this.props;

        return c('pur-Clickable', className, {

        });
    }
}

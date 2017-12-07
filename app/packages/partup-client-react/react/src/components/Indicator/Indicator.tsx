import './Indicator.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    onClick?: Function;
}

interface State {}

export class Indicator extends React.Component<Props, State> {

    public render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()} onClick={this.onClick}>
                {children}
            </div>
        );
    }

    private onClick = (event: React.SyntheticEvent<any>) => {
        const { onClick } = this.props;

        if (onClick) onClick(event);
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Indicator', {
            // 'pur-Indicator--modifier-class': boolean,
        }, className);
    }
}

import './NewIndicator.css';

import * as React from 'react';
import * as c from 'classnames';
import { Indicator } from 'components/Indicator/Indicator';

interface Props {
    className?: string;
    onClick?: Function;
}

interface State {}

export class NewIndicator extends React.Component<Props, State> {

    public render() {
        const {
            children,
        } = this.props;

        return (
            <Indicator className={this.getClassNames()} onClick={this.onClick}>
                {children}
            </Indicator>
        );
    }

    private onClick = (event: React.SyntheticEvent<any>) => {
        const { onClick } = this.props;

        if (onClick) onClick(event);
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-NewIndicator', {
            // 'pur-NewIndicator--modifier-class': boolean,
        }, className);
    }
}

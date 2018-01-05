import './Tag.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

interface State {}

export class Tag extends React.Component<Props, State> {

    public render() {
        const {
            children,
        } = this.props;

        return (
            <span className={this.getClassNames()}>
                {children}
            </span>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Tag', {
            // 'pur-Tag--modifier-class': boolean,
        }, className);
    }
}

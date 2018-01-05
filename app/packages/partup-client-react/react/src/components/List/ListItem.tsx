import './ListItem.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    stretch?: boolean;
    alignRight?: boolean;
}

export class ListItem extends React.Component<Props, {}> {

    public render() {
        const { children } = this.props;

        return (
            <li className={this.getClassNames()}>
                {children}
            </li>
        );
    }

    private getClassNames() {
        const { className, stretch, alignRight } = this.props;

        return c('pur-ListItem', className, {
            'pur-ListItem--stretch': stretch,
            'pur-ListItem--align-right': alignRight,
        });
    }
}

import * as React from 'react';
import * as c from 'classnames';
import './ListItem.css';

interface Props {
    className?: string;
    stretch?: boolean;
    alignRight?: boolean;
}

export default class ListItem extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className, stretch, alignRight } = this.props;

        return c('pur-ListItem', className, {
            'pur-ListItem--stretch': stretch,
            'pur-ListItem--align-right': alignRight,
        });
    }

    render() {
        const { children } = this.props;

        return (
            <li className={this.getClassNames()}>
                {children}
            </li>
        );
    }
}

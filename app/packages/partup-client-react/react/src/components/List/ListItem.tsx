import * as React from 'react';
import * as c from 'classnames';
import './ListItem.css';

interface Props {
    className?: string;
    stretch?: boolean;
}

export default class ListItem extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className, stretch } = this.props;

        return c('pur-ListItem', className, {
            'pur-ListItem--stretch': stretch,
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

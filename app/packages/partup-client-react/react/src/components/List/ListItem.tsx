import * as React from 'react';
import * as c from 'classnames';
import './ListItem.css';

interface Props {
    className?: string;
}

export default class ListItem extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-ListItem', className, {

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

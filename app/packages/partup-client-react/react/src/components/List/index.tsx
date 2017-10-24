import * as React from 'react';
import * as c from 'classnames';
import './List.css';

interface Props {
    className?: string;
}

export default class List extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-List', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <ul className={this.getClassNames()}>
                {children}
            </ul>
        );
    }
}

export { default as ListItem } from './ListItem';

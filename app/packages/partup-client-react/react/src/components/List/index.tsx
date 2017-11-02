import * as React from 'react';
import * as c from 'classnames';
import './List.css';

interface Props {
    className?: string;
    horizontal?: boolean;
    spaced?: boolean;
}

export default class List extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className, horizontal, spaced } = this.props;

        return c('pur-List', className, {
            'pur-List--horizontal': horizontal,
            'pur-List--spaced': spaced,
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

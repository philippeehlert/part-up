import './List.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    horizontal?: boolean;
    spaced?: boolean;
}

export class List extends React.Component<Props, {}> {

    public render() {
        const { children } = this.props;

        return (
            <ul className={this.getClassNames()}>
                {children}
            </ul>
        );
    }

    private getClassNames() {
        const { className, horizontal, spaced } = this.props;

        return c('pur-List', className, {
            'pur-List--horizontal': horizontal,
            'pur-List--spaced': spaced,
        });
    }
}

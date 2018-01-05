import './ModalFooter.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class ModalFooter extends React.Component<Props, {}> {

    public render() {
        const { children } = this.props;

        return (
            <footer className={this.getClassNames()}>
                {children}
            </footer>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ModalFooter', className, {

        });
    }
}

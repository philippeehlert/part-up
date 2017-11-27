import './ModalContent.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class ModalContent extends React.Component<Props, {}> {

    public render() {
        const { children } = this.props;

        return (
            <article className={this.getClassNames()}>
                {children}
            </article>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ModalContent', className, {

        });
    }
}

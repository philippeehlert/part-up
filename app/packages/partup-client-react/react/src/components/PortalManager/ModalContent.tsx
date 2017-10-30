import * as React from 'react';
import * as c from 'classnames';
import './ModalContent.css';

interface Props {
    className?: string;
}

export default class ModalContent extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-ModalContent', className, {

        });
    }
    
    render() {
        const { children } = this.props;

        return (
            <article className={this.getClassNames()}>
                {children}
            </article>
        );
    }
}
import * as React from 'react';
import * as c from 'classnames';
import './ModalFooter.css';

interface Props {
    className?: string;
}

export default class ModalFooter extends React.Component<Props, {}> {
    
    getClassNames = () => {
        const { className } = this.props;

        return c('pur-ModalFooter', className, {

        });
    }
    
    render() {
        const { children } = this.props;

        return (
            <footer className={this.getClassNames()}>
                {children}
            </footer>
        );
    }
}
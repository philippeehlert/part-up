import * as React from 'react';
import * as c from 'classnames';
import './ModalPortal.css';

import Portal from './Portal';

interface Props {
    className?: string;
}

interface ModalPortalProps extends Props {
    onBackgroundClick: Function;
}

export default class ModalPortal extends React.Component<ModalPortalProps, {}> {

    static defaultProps = {

    };

    onBackgroundClick = (event: React.SyntheticEvent<any>) => {
        const { onBackgroundClick } = this.props;
    
        if (onBackgroundClick) onBackgroundClick(event);
    }

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-ModalPortal', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <Portal className={this.getClassNames()} onClick={this.onBackgroundClick}>
                {children}
            </Portal>
        );
    }
}

export { default as ModalWindow } from './ModalWindow';
export { default as ModalHeader } from './ModalHeader';
export { default as ModalContent } from './ModalContent';
export { default as ModalFooter } from './ModalFooter';

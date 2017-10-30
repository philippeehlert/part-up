import * as React from 'react';
import * as c from 'classnames';
import './Modal.css';

import {
    Icon,
} from 'components';

import Portal from './Portal';
import { Clickable } from 'components/Button';

interface Props {
    className?: string;
}

interface ModalProps extends Props {
    onClose: Function;
}

interface ModalHeaderProps extends Props {
    title?: string;
    onClose: Function;
}

export default class Modal extends React.Component<ModalProps, {}> {

    static defaultProps = {

    };

    onClose = (event: React.SyntheticEvent<any>) => {
        const { onClose } = this.props;
    
        if (onClose) onClose(event);
    }

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Modal', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <Portal className={this.getClassNames()} onClick={this.onClose}>
                <div className={'pur-Modal__window'}>
                    {children}
                </div>
            </Portal>
        );
    }
}

export class ModalHeader extends React.Component<ModalHeaderProps, {}> {

    onClose = (event: React.SyntheticEvent<any>) => {
        const { onClose } = this.props;
    
        if (onClose) onClose(event);
    }

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-ModalHeader', className, {

        });
    }

    render() {
        const { title } = this.props;

        return (
            <header className={this.getClassNames()}>
                <h3 className={'pur-ModalHeader__title'}>{title}</h3>
                <Clickable onClick={this.onClose} className={'pur-ModalHeader__close-button'}>
                    <Icon name={'times'} />
                </Clickable>
            </header>
        );
    }
}

export class ModalContent extends React.Component<Props, {}> {

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

export class ModalFooter extends React.Component<Props, {}> {
    
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
import * as React from 'react';
import * as c from 'classnames';
import './ModalHeader.css';

import { Icon } from 'components/Icon/Icon';
import { Clickable } from 'components/Button/Clickable';

interface Props {
    className?: string;
}

interface ModalHeaderProps extends Props {
    title?: string;
    onClose: Function;
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

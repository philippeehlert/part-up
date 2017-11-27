import * as React from 'react';
import * as c from 'classnames';
import './ModalPortal.css';
import { Portal } from 'components/PortalManager/Portal';

interface Props {
    className?: string;
}

interface ModalPortalProps extends Props {
    onBackgroundClick: Function;
}

export class ModalPortal extends React.Component<ModalPortalProps, {}> {

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

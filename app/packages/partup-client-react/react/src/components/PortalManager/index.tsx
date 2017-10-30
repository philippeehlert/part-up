import * as React from 'react';

interface Props {
    className?: string;
    onOpen?: Function;
    onClose?: Function;
    renderHandler: (open: Function) => JSX.Element;
    renderPortal: (close: Function) => JSX.Element;
}

interface State {
    render: boolean;
}

interface PortalManagerWrapperProps {
    children: any;
}

const PortalManagerWrapper: React.SFC<PortalManagerWrapperProps> = ({ children }) => (children);

export default class PortalManager extends React.Component<Props, State> {

    state: State = {
        render: false,
    };

    onOpen = (event: Object) => {
        const { onOpen } = this.props;

        if (onOpen) onOpen(event);
    }

    onClose = (event: Object) => {
        const { onClose } = this.props;

        if (onClose) onClose(event);
    }

    close = () => {
        this.setState({ render: false });
    }

    open = () => {
        this.setState({ render: true });
    }

    render(): any {
        const { render } = this.state;
        const { renderHandler, renderPortal } = this.props;

        return [
            <PortalManagerWrapper key={'handler'}>
                {renderHandler(this.open)}
            </PortalManagerWrapper>,
            render && (
                <PortalManagerWrapper key={'portal'}>
                    {renderPortal(this.close)}
                </PortalManagerWrapper>
            ),
        ];
    }
}

export { default as Portal } from './Portal';
export { default as Modal } from './Modal';
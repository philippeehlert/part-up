import * as React from 'react';

interface Props {
    className?: string;
    onOpen?: Function;
    onClose?: Function;
    renderHandler?: (open: Function) => JSX.Element;
    renderPortal: (close: Function) => JSX.Element;
}

interface State {
    render: boolean;
}

interface PortalManagerWrapperProps {
    children: any;
}

const PortalManagerWrapper: React.SFC<PortalManagerWrapperProps> = ({ children }) => (children);

export class PortalManager extends React.Component<Props, State> {

    public state: State = {
        render: false,
    };

    public render() {
        const { render } = this.state;
        const { renderHandler, renderPortal } = this.props;

        return [
            <PortalManagerWrapper key={'handler'}>
                {renderHandler && renderHandler(this.open)}
            </PortalManagerWrapper>,
            render && (
                <PortalManagerWrapper key={'portal'}>
                    {renderPortal(this.close)}
                </PortalManagerWrapper>
            ),
        ] as (JSX.Element)[];
    }

    private close = () => {
        this.setState({ render: false });
    }

    private open = () => {
        this.setState({ render: true });
    }
}

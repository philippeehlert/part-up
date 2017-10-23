import * as React from 'react';
import * as ReactDOM from 'react-dom';

const portalRoot = document.getElementById('react-portal') as HTMLElement;

export default class Portal extends React.Component<{}, {}> {

    private portalElement: HTMLElement;

    constructor(props: Object) {
        super(props);

        this.portalElement = document.createElement('div');
    };

    componentDidMount() {
        portalRoot.appendChild(this.portalElement);
    };

    componentWillUnmount() {
        portalRoot.removeChild(this.portalElement);
    };

    render() {
        const { children } = this.props;

        return ReactDOM.createPortal(children, this.portalElement);
    };
};

export { default as PortalManager } from './PortalManager';

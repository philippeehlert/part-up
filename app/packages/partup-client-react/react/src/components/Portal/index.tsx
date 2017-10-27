import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class Portal extends React.Component<{}, {}> {

    private portalElement: HTMLElement;
    private portalRoot: HTMLElement;

    constructor(props: Object) {
        super(props);

        this.portalRoot = document.getElementById('react-portal-root') as HTMLElement;        
        this.portalElement = document.createElement('div');
    }

    componentDidMount() {
        this.portalRoot.appendChild(this.portalElement);
    }

    componentWillUnmount() {
        this.portalRoot.removeChild(this.portalElement);
    }

    render() {
        const { children } = this.props;

        return ReactDOM.createPortal(children, this.portalElement);
    }
}

export { default as PortalManager } from './PortalManager';

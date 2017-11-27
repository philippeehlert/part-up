import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './Portal.css';

interface Props {
    className?: string;
    onClick?: Function;
}

export class Portal extends React.Component<Props, {}> {

    private portalElement: HTMLElement;
    private portalRoot: HTMLElement;

    constructor(props: Props) {
        super(props);

        const { className } = this.props;

        this.portalRoot = document.getElementById('react-portal-root') as HTMLElement;
        this.portalElement = document.createElement('div');
        this.portalElement.classList.add('pur-Portal');

        if (className) {
            className.split(' ').forEach((name) => {
                this.portalElement.classList.add(name);
            });
        }
    }

    onClick = (event: MouseEvent) => {
        if (event.target !== this.portalElement) return;

        const { onClick } = this.props;

        if (onClick) onClick(event);
    }

    componentDidMount() {
        this.portalRoot.appendChild(this.portalElement);
        this.portalElement.addEventListener('click', this.onClick);
    }

    componentWillUnmount() {
        this.portalRoot.removeChild(this.portalElement);
        this.portalElement.removeEventListener('click', this.onClick);
    }

    render() {
        const { children } = this.props;

        return ReactDOM.createPortal(children, this.portalElement);
    }
}

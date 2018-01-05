import './Router.css';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';

import {
    onRouteChange,
    activeRoutes,
    getCurrentRoute,
} from 'utils/router';

interface Props {
    className?: string;
    onBackRoute?: (event: Object) => void;
}
export class Router extends React.Component<Props, {}> {

    public static contextTypes = {
        router: PropTypes.object,
    };

    public componentWillMount() {
        const currentRoute = getCurrentRoute();

        if (activeRoutes.includes(currentRoute)) {
            this.onActivate();
        }

        onRouteChange((route: string) => {
            if (activeRoutes.includes(route)) {
                this.onActivate();
            } else {
                this.onDeactivate();
            }
        });
    }

    public componentWillUnmount() {
        this.onDeactivate();
    }

    public render() {
        const { children } = this.props;

        return (
            <div className={this.getClassNames()}>
                {children}
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Router', className, {

        });
    }

    private onActivate() {
        const element = document.querySelector('.pu-main') as HTMLElement;

        if (element) element.classList.add('pu-main--react');
    }

    private onDeactivate() {
        const element = document.querySelector('.pu-main') as HTMLElement;

        if (element) element.classList.remove('pu-main--react');
    }
}

import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';
// import * as $ from 'jquery';
import './Router.css';
import {
    onRouteChange,
    activeRoutes,
    getCurrentRoute,
} from 'utils/router';

interface Props {
    className?: string;
    onBackRoute?: (event: Object) => void;
}
export default class Router extends React.Component<Props, {}> {

    static contextTypes = {
        router: PropTypes.object,
    };

    onActivate() {
        const element = document.querySelector('.pu-main') as HTMLElement;
        
        if (element) element.classList.add('pu-main--react');
    }

    onDeactivate() {
        const element = document.querySelector('.pu-main') as HTMLElement;

        if (element) element.classList.remove('pu-main--react');
    }

    componentWillMount() {
        // $(window).on('popstate', this.onBackRoute);

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

    componentWillUnmount() {
        // $(window).off('popstate', this.onBackRoute);

        this.onDeactivate();
    }

    // onBackRoute = (event: Object) => {
    //     const { onBackRoute } = this.props;
    //     const { router } = this.context;

    //     router.history.goBack();

    //     if (onBackRoute) onBackRoute(event);
    // }

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Router', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <div className={this.getClassNames()}>
                {children}
            </div>
        );
    }
}

export { default as Link } from './Link';
export { default as NavLink } from './NavLink';

// variants on link or navlink
export { default as MenuLink } from './MenuLink';
export { default as MainNavLink } from './MainNavLink';

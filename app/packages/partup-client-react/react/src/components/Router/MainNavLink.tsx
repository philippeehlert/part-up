import * as React from 'react';
import * as c from 'classnames';
import './MainNavLink.css';

import { NavLink, NavLinkProps } from './NavLink';

export class MainNavLink extends React.Component<NavLinkProps, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-MainNavLink', className, {

        });
    }

    render() {
        return (
            <NavLink
                className={this.getClassNames()}
                activeClassName={`pur-MainNavLink--is-active`}
                {...this.props}/>
        );
    }
}

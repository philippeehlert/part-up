import './MainNavLink.css';

import * as React from 'react';
import * as c from 'classnames';

import { NavLink, NavLinkProps } from './NavLink';

export class MainNavLink extends React.Component<NavLinkProps, {}> {

    public render() {
        return (
            <NavLink
                className={this.getClassNames()}
                activeClassName={`pur-MainNavLink--is-active`}
                {...this.props}/>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-MainNavLink', className, {

        });
    }
}

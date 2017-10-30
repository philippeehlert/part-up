import * as React from 'react';
import * as c from 'classnames';
import './MenuLink.css';

import NavLink from './NavLink';

interface Props {
    icon?: JSX.Element|Element|string;
    counter?: string|number;
    to: string;
    className?: string;
}

export default class MenuLink extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-MenuLink', className, {

        });
    }

    render() {
        const {
            icon,
            children,
            counter,
            to,
        } = this.props;

        return (
            <NavLink
                to={to}
                className={this.getClassNames()}
                activeClassName={'pur-MenuLink--is-active'}
                exact
                leftChild={icon}
                rightChild={counter}>
                { children }
            </NavLink>
        );
    }
}

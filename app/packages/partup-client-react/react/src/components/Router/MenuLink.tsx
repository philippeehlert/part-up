import * as React from 'react';
import * as c from 'classnames';
import './MenuLink.css';

import { NavLink } from './NavLink';
import { TargetType } from './Link';

interface Props {
    icon?: JSX.Element|Element|string;
    counter?: JSX.Element|string|number;
    to: string;
    className?: string;
    target?: TargetType;
}

export class MenuLink extends React.Component<Props, {}> {

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
            ...rest,
        } = this.props;

        return (
            <NavLink
                to={to}
                className={this.getClassNames()}
                activeClassName={'pur-MenuLink--is-active'}
                exact
                leftChild={icon}
                rightChild={counter}
                {...rest}>
                { children }
            </NavLink>
        );
    }
}

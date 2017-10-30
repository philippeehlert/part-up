import * as React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';
import './NavLink.css';

interface Props {
    className?: string;
    activeClassName?: string;
    children?: any;
    to?: any;
    leftChild?: any;
    rightChild?: any;
    exact?: boolean;
}

export default class NavLink extends React.Component<Props, {}> {

    static contextTypes = {
        router: PropTypes.object,
    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-NavLink', className, {

        });
    }

    getActiveClassNames = () => {
        const { activeClassName } = this.props;

        return c('pur-NavLink--is-active', activeClassName, {

        });
    }

    render() {
        const {
            leftChild,
            children,
            rightChild,
            to,
            exact,
        } = this.props;

        return (
            <RouterNavLink
                to={to}
                exact={exact}
                activeClassName={this.getActiveClassNames()}
                className={this.getClassNames()}>
                { leftChild && (
                    <span className={`pur-NavLink__left-child`}>
                        { leftChild }
                    </span>
                ) }
                { children && (
                    <span className={`pur-NavLink__content`}>
                        { children }
                    </span>
                ) }
                { rightChild && (
                    <span className={`pur-NavLink__right-child`}>
                        { rightChild }
                    </span>
                ) }
            </RouterNavLink>
        );
    }
}

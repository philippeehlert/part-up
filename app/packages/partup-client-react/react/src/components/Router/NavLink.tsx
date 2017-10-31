import * as React from 'react';
import { Route } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';
import './NavLink.css';
import Link, { TargetType } from './Link';

interface Props {
    className?: string;
    activeClassName?: string;
    onClick?: Function;
    children?: any;
    to?: any;
    leftChild?: any;
    rightChild?: any;
    exact?: boolean;
    strict?: boolean;
    location?: any;
    isActive?: Function;
    target?: TargetType;
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
            to,
            exact,
            strict,
            location,
            isActive: getIsActive,
            ...rest,
        } = this.props;
        const path = typeof to === 'object' ? to.pathname : to;
        const escapedPath = path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

        return (
            <Route
                path={escapedPath}
                exact={exact}
                strict={strict}
                location={location}
                children={({ location: currentLocation, match }) => {
                    const isActive = !!(getIsActive ? getIsActive(match, currentLocation) : match);

                    return (
                        <Link
                            to={to}
                            {...rest}
                            className={
                                isActive ?
                                [ this.getClassNames(), this.getActiveClassNames() ].filter(i => i).join(' ')
                                :
                                this.getClassNames()
                            }
                            />
                    );
                }}
                />
        );
    }
}

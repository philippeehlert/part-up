import * as React from 'react';
import * as c from 'classnames';
import './NavLink.css';

import Link from '../Router/Link'

interface Props {
    icon?: Element|string;
    counter?: string|number;
    to: string;
    className?: string;
};

export default class NavLink extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-NavLink', className, {

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
            <Link to={to} className={this.getClassNames()}>
                { icon && <span className={`pur-NavLink__icon`}>{ icon }</span> }
                <span className={`pur-NavLink__label`}>{ children }</span>
                { counter && <span className={`pur-NavLink__counter`}>{ counter }</span> }
            </Link>
        );
    }
}

import * as React from 'react';
import * as c from 'classnames';
import './MenuLink.css';

import Link from '../Router/Link'

interface Props {
    icon?: JSX.Element|Element|string;
    counter?: string|number;
    to: string;
    className?: string;
};

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
            <Link to={to} className={this.getClassNames()}>
                { icon && <span className={`pur-MenuLink__icon`}>{ icon }</span> }
                <span className={`pur-MenuLink__label`}>{ children }</span>
                { counter && <span className={`pur-MenuLink__counter`}>{ counter }</span> }
            </Link>
        );
    }
}

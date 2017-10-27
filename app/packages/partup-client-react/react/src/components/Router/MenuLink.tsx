import * as React from 'react';
import * as c from 'classnames';
import './MenuLink.css';

import Link from './Link';

interface Props {
    icon?: JSX.Element|Element|string;
    isActive?: boolean;
    counter?: string|number;
    to: string;
    className?: string;
}

export default class MenuLink extends React.Component<Props, {}> {

    getClassNames() {
        const { className, isActive } = this.props;

        return c('pur-MenuLink', className, {
            'pur-MenuLink--is-active': isActive,
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
            <Link
                to={to}
                className={this.getClassNames()}
                leftChild={icon}
                rightChild={counter}>
                { children }
            </Link>
        );
    }
}

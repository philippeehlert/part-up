import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';
import './Link.css';

interface Props {
    children?: any;
    className?: string;
    onClick?: Function;
    to?: string;
}

export default class Link extends React.Component<Props, {}> {

    static contextTypes = {
        router: PropTypes.object,
    };

    onClick = (event: any) => {
        event.nativeEvent.preventDefault();
        const { onClick, to } = this.props;
        const { router } = this.context;

        router.history.push(to);

        if (onClick) onClick(event);
    }

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Link', className, {

        });
    }

    render() {
        const { children, to } = this.props;

        return (
            <a className={this.getClassNames()} href={to} onClick={this.onClick}>
                {children}
            </a>
        );
    }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

export default class Link extends Component {

    static contextTypes = {
        router: PropTypes.object,
    };

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        onClick: PropTypes.func,
        to: PropTypes.string,
    };

    static defaultProps = {

    };

    onClick = (event) => {
        event.nativeEvent.preventDefault();
        const { onClick, to } = this.props;
        const { router } = this.context;

        router.history.push(to);

        if (onClick) onClick(event);
    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Link', className, {

        });
    };

    render() {
        const { children } = this.props;

        return (
            <a className={this.getClassNames()} href={'#'} onClick={this.onClick}>
                {children}
            </a>
        );
    }
};

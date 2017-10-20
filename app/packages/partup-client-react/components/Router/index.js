import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import $ from 'jquery';

export default class Router extends Component {

    static contextTypes = {
        router: PropTypes.object,
    };

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        onBackRoute: PropTypes.func,
    };

    componentWillMount() {
        $(window).on('popstate', this.onBackRoute);
    };

    componentWillUnmount() {
        $(window).off('popstate', this.onBackRoute);
    };

    onBackRoute = (event) => {
        const { onBackRoute } = this.props;
        const { router } = this.context;

        router.history.goBack();

        if (onBackRoute) onBackRoute(event);
    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Router', className, {

        });
    };

    render() {
        const { children } = this.props;

        return (
            <div className={this.getClassNames()}>
                {children}
            </div>
        );
    }
};

export { default as Link } from './Link';

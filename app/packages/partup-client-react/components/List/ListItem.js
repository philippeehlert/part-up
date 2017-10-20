import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

export default class ListItem extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
    };

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-ListItem', className, {

        });
    };

    render() {
        const { children } = this.props;

        return (
            <li className={this.getClassNames()}>
                {children}
            </li>
        );
    }
};

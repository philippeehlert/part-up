import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

export default class List extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
    };

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-List', className, {

        });
    };

    render() {
        const { children } = this.props;

        return (
            <ul className={this.getClassNames()}>
                {children}
            </ul>
        );
    };
};

export { default as ListItem } from './ListItem';

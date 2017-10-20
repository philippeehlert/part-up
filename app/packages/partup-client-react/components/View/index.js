import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

export default class View extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
    };

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-View', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <div className={this.getClassNames()}>
                {children}
            </div>
        );
    }
};

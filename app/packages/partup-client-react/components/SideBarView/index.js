import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

export default class SideBarView extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        sidebar: PropTypes.element,
    };

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-SideBarView', className, {

        });
    };

    render() {
        const { children, sidebar } = this.props;

        return (
            <div className={this.getClassNames()}>
                <div className={'pur-SideBarView__sidebar'}>
                    { sidebar }
                </div>
                <div className={'pur-SideBarView__content'}>
                    { children }
                </div>
            </div>
        );
    };
};

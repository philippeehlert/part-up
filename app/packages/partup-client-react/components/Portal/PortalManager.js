import React, { Component } from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

export default class PortalManager extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        renderHandler: PropTypes.func,
        renderPortal: PropTypes.func,
    };

    static defaultProps = {

    };

    state = {
        render: false,
    };

    onOpen = (event) => {
        const { onOpen } = this.props;

        if (onOpen) onOpen(event);
    };

    onClose = (event) => {
        const { onClose } = this.props;

        if (onClose) onClose(event);
    };

    close = () => {
        this.setState({render: false});
    };

    open = () => {
        this.setState({render: true});
    };

    Comp = ({children}) => (children);

    render() {
        const { render } = this.state;
        const { renderHandler, renderPortal } = this.props;

        return [
            <this.Comp key={'handler'}>
                { renderHandler(this.open) }
            </this.Comp>,
            render && (
                <this.Comp key={'portal'}>
                    { renderPortal(this.close) }
                </this.Comp>
            ),
        ];
    }
};

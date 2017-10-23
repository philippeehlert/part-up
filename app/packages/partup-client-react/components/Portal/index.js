import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const portalRoot = document.getElementById('react-portal');

export default class Portal extends Component {

    static propTypes = {
        children: PropTypes.any,
    };

    static defaultProps = {

    };

    constructor(props) {
        super(props);

        this.portalElement = document.createElement('div');
    };

    componentDidMount() {
        portalRoot.appendChild(this.portalElement);
    };

    componentWillUnmount() {
        portalRoot.removeChild(this.portalElement);
    };

    render() {
        const { children } = this.props;

        return createPortal(children, this.portalElement);
    };
};

export { default as PortalManager } from './PortalManager';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';
import './Link.css';

const dev = process.env.REACT_APP_DEV;

export enum TargetType {
    blank = '_blank',
    self = '_self',
    parent = '_parent',
    top = '_top',
    partup = '_partup',
}

interface Props {
    className?: string;
    children?: any;
    onClick?: Function;
    to?: any;
    leftChild?: any;
    rightChild?: any;
    target?: TargetType;
}

export default class Link extends React.Component<Props, {}> {

    static contextTypes = {
        router: PropTypes.object,
    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Link', className, {

        });
    }

    onClick = (event: React.SyntheticEvent<any>) => {
        const { onClick, to, target } = this.props;
        const { router } = this.context;

        if (!target) {
            event.preventDefault();
            router.history.push(to);    
        }

        if (onClick) onClick(event);
    }

    getHref = () => {
        const { to, target } = this.props;

        if (target === '_partup') return to;

        return dev ? to : '#';
    }

    render() {
        const {
            leftChild,
            children,
            rightChild,
        } = this.props;

        return (
            <a
                href={this.getHref()}
                className={this.getClassNames()}
                onClick={this.onClick}>
                { leftChild && (
                    <span className={`pur-Link__left-child`}>
                        { leftChild }
                    </span>
                ) }
                { children && (
                    <span className={`pur-Link__content`}>
                        { children }
                    </span>
                ) }
                { rightChild && (
                    <span className={`pur-Link__right-child`}>
                        { rightChild }
                    </span>
                ) }
            </a>
        );
    }
}

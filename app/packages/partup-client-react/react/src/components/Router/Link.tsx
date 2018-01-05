import './Link.css';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as c from 'classnames';

export type TargetType = '_blank' | '_self' | '_parent' | '_top' | '_partup';

interface Props {
    className?: string;
    children?: any;
    onClick?: Function;
    to?: any;
    leftChild?: any;
    rightChild?: any;
    target?: TargetType;
}

export class Link extends React.Component<Props, {}> {

    public static contextTypes = {
        router: PropTypes.object,
    };

    public render() {
        const {
            leftChild,
            children,
            rightChild,
        } = this.props;

        return (
            <a
                target={this.getTarget()}
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

    private onClick = (event: React.SyntheticEvent<any>) => {
        const { onClick, to, target } = this.props;
        const { router } = this.context;

        if (!target) {
            event.preventDefault();
            router.history.push(to);
        }

        if (onClick) onClick(event);
    }

    private getHref() {
        const { to, target } = this.props;

        if (target === '_partup') return to;

        return '#';
    }

    private getTarget() {
        const { target } = this.props;

        if (target === '_partup') return undefined;

        return target;
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Link', className, {

        });
    }
}

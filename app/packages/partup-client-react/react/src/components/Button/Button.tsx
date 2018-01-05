import './Button.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    type?: 'button'|'submit';
    leftChild?: any;
    rightChild?: any;
    onClick?: Function;
}

export class Button extends React.Component<Props, {}> {

    public static defaultProps: Partial<Props> = {
        type: 'button',
    };

    public render() {
        const {
            leftChild,
            children,
            rightChild,
        } = this.props;

        return (
            <button className={this.getClassNames()} onClick={this.onClick}>
                { leftChild && (
                    <span className={`pur-Button__left-child`}>
                        { leftChild }
                    </span>
                ) }
                { children && (
                    <span className={`pur-Button__content`}>
                        { children }
                    </span>
                ) }
                { rightChild && (
                    <span className={`pur-Button__right-child`}>
                        { rightChild }
                    </span>
                ) }
            </button>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Button', className, {

        });
    }

    private onClick = (event: React.SyntheticEvent<any>) => {
        const { onClick } = this.props;

        if (onClick) onClick(event);
    }
}

import * as React from 'react';
import * as c from 'classnames';
import './Button.css';

export enum ButtonType {
    link = 'submit',
    button = 'button',
    submit = 'submit',
}

interface Props {
    icon?: Element
    counter?: string|number
    className?: string
    type?: ButtonType
}

export default class Button extends React.Component<Props, {}> {
    static defaultProps = {
        type: ButtonType.button
    }

    getClassNames() {
        const { className } = this.props;

        return c('pur-Button', className, {

        });
    }

    render() {
        const {
            icon,
            children,
            counter,
        } = this.props;

        return (
            <button className={this.getClassNames()}>
                { icon && <span className={`pur-Button__icon`}>{ icon }</span> }
                <span className={`pur-Button__label`}>{ children }</span>
                { counter && <span className={`pur-Button__counter`}>{ counter }</span> }
            </button>
        );
    }
}

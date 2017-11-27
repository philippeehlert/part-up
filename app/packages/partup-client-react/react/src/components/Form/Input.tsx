import './Input.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    type: string;
    name: string;
    placeholder?: string;
    onFocus?: () => void
    onBlur?: () => void
}

export class Input extends React.Component<Props, {}> {

    private element: HTMLInputElement|null = null;

    public render() {
        const {
            type,
            name,
            placeholder,
            onFocus,
            onBlur,
        } = this.props;

        return (
            <input
                type={type}
                name={name}
                ref={el => this.element = el}
                placeholder={placeholder}
                className={this.getClassNames()}
                onFocus={onFocus ? onFocus : undefined}
                onBlur={onBlur ? onBlur : undefined}
            />
        );
    }

    public focus() {
        if (this.element) {
            this.element.focus();
        }
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Input', className, {

        });
    }
}

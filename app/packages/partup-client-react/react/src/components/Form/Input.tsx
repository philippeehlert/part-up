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
                placeholder={placeholder}
                className={this.getClassNames()}
                onFocus={onFocus ? onFocus : undefined}
                onBlur={onBlur ? onBlur : undefined}
            />
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Input', className, {

        });
    }
}

import './Form.css';

import * as React from 'react';
import * as c from 'classnames';

const getFormData = require('get-form-data');

interface Props {
    className?: string;
    onSubmit: Function;
}

export class Form extends React.Component<Props, {}> {

    private form?: HTMLFormElement = undefined;

    public render() {
        const { children } = this.props;

        return (
            <form
                className={this.getClassNames()}
                onSubmit={this.onSubmit}
                ref={(form: HTMLFormElement) => this.form = form}>
                {children}
            </form>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Form', className, {

        });
    }

    private onSubmit = (event: React.SyntheticEvent<any>) => {
        const { onSubmit } = this.props;
        event.preventDefault();

        const fields = getFormData(this.form);

        if (onSubmit) onSubmit(event, fields);
    }
}

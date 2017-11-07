import * as React from 'react';
import * as c from 'classnames';
import './Form.css';
const getFormData = require('get-form-data');

interface Props {
    className?: string;
    onSubmit: Function;
}

export default class Form extends React.Component<Props, {}> {
    
    static defaultProps = {
        
    };
    
    private form?: HTMLFormElement = undefined;
    
    render() {
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

    private getClassNames = () => {
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

export { default as FieldCollection } from './FieldCollection';
export { default as FieldSet } from './FieldSet';
export { default as Label } from './Label';
export { default as Input } from './Input';
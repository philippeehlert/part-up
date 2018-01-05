import './FieldSet.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class FieldSet extends React.Component<Props, {}> {

    public render() {
        const { children } = this.props;

        return (
            <fieldset className={this.getClassNames()}>
                {children}
            </fieldset>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-FieldSet', className, {

        });
    }
}

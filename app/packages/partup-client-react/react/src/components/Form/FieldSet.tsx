import * as React from 'react';
import * as c from 'classnames';
import './FieldSet.css';

interface Props {
    className?: string;
}

export class FieldSet extends React.Component<Props, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-FieldSet', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <fieldset className={this.getClassNames()}>
                {children}
            </fieldset>
        );
    }
}

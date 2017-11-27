import * as React from 'react';
import * as c from 'classnames';
import './FieldCollection.css';

interface Props {
    className?: string;
}

export class FieldCollection extends React.Component<Props, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-FieldCollection', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <div className={this.getClassNames()}>
                {children}
            </div>
        );
    }
}

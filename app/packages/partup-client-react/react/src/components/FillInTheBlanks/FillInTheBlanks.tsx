import * as React from 'react';
import * as c from 'classnames';
import './FillInTheBlanks.css';

interface Props {
    className?: string;
}

export class FillInTheBlanks extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-FillInTheBlanks', className, {

        });
    }

    render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { children }
            </div>
        );
    }
}

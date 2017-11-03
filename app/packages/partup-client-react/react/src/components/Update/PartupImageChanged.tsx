
import * as React from 'react';
import * as c from 'classnames';
import './PartupImageChanged.css';

interface Props {
    className?: string;
}

export default class PartupImageChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupImageChanged', className, {

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

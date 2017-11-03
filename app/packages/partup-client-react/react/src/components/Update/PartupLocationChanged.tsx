
import * as React from 'react';
import * as c from 'classnames';
import './PartupLocationChanged.css';

interface Props {
    className?: string;
}

export default class PartupLocationChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupLocationChanged', className, {

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

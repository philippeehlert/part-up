
import * as React from 'react';
import * as c from 'classnames';
import './ChangedRegion.css';

interface Props {
    className?: string;
}

export default class ChangedRegion extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ChangedRegion', className, {

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

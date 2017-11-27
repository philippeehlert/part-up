
import * as React from 'react';
import * as c from 'classnames';
import './PartupLocationChanged.css';

interface Props {
    className?: string;
}

export class PartupLocationChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupLocationChanged', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_location_changed` }
            </div>
        );
    }
}

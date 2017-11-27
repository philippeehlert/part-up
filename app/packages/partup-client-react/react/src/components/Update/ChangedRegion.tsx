
import * as React from 'react';
import * as c from 'classnames';
import './ChangedRegion.css';

interface Props {
    className?: string;
    data: any;
}

export class ChangedRegion extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ChangedRegion', className, {

        });
    }

    render() {
        const { data } = this.props;

        console.log(data);

        return (
            <div className={this.getClassNames()}>
                {`changed_region`}
            </div>
        );
    }
}

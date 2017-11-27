import './PartupSupporterAdded.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    data: any;
}

export class PartupSupporterAdded extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                {`no-update-yet`}
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupSupporterAdded', className, {

        });
    }
}

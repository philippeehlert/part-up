import './PartupUpperAdded.css';

import * as React from 'react';
import * as c from 'classnames';
import { UpdateDocument } from 'collections/Updates';

interface Props {
    className?: string;
    data: UpdateDocument;
}

export class PartupUpperAdded extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                {`no-update-yet`}
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupUpperAdded', className, {

        });
    }
}

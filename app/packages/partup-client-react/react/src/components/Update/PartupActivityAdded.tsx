import './PartupActivityAdded.css';

import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';
import { Activity } from 'components/Activity/Activity';
import { UpdateDocument } from 'collections/Updates';

interface Props {
    className?: string;
    data: UpdateDocument;
}

export class PartupActivityAdded extends React.Component<Props, {}> {

    public render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                <Activity _id={get(data, 'type_data.activity_id')} />
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityAdded', className, {

        });
    }
}

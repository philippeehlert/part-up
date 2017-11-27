import './PartupActivityArchived.css';

import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';
import { Activity } from 'components/Activity/Activity';

interface Props {
    className?: string;
    data: any;
}

export class PartupActivityArchived extends React.Component<Props, {}> {

    public render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                <Activity _id={get(data, 'type_data.activity_id')} data={data.activity} />
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityArchived', className, {

        });
    }
}

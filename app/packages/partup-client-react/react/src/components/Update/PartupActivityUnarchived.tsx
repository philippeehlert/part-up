
import * as React from 'react';
import * as c from 'classnames';
import './PartupActivityUnarchived.css';
import { get } from 'lodash';
import { Activity } from 'components/Activity/Activity';

interface Props {
    className?: string;
    data: any;
}

export class PartupActivityUnarchived extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityUnarchived', className, {

        });
    }

    render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                <Activity _id={get(data, 'type_data.activity_id')} data={data.activity} />
            </div>
        );
    }
}


import * as React from 'react';
import * as c from 'classnames';
import './PartupActivityCommentAdded.css';
import Activity from 'components/Activity';
import { get } from 'lodash';

interface Props {
    className?: string;
    data: any;
}

export default class PartupActivityCommentAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityCommentAdded', className, {

        });
    }

    render() {
        const { data } = this.props;
        
        return (
            <div className={this.getClassNames()}>
                <Activity _id={get(data, 'type_data.activity_id')} />
            </div>
        );
    }
}

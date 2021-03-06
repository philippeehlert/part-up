import './PartupEndDateChanged.css';

import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';
import * as moment from 'moment';
import { Icon } from 'components/Icon/Icon';
import { UpdateDocument } from 'collections/Updates';

interface Props {
    className?: string;
    data: UpdateDocument;
}

export class PartupEndDateChanged extends React.Component<Props, {}> {

    public render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                <span className={'pur-PartupEndDateChanged__label'}>
                    { moment(get(data, 'type_data.new_end_date')).format('MMMM Do YYYY') }
                </span>
                <Icon className={'pur-PartupEndDateChanged__icon'} name={'arrow-left'} />
                <span className={'pur-PartupEndDateChanged__label'}>
                    { moment(get(data, 'type_data.old_end_date')).format('MMMM Do YYYY') }
                </span>
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupEndDateChanged', className, {

        });
    }
}

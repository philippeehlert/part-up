
import * as React from 'react';
import * as c from 'classnames';
import './PartupTagChanged.css';
import { get } from 'lodash';
import { Icon } from 'components/Icon/Icon';

interface Props {
    className?: string;
    data: any;
}

export class PartupTagChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupTagChanged', className, {

        });
    }

    render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                <span className={'pur-PartupTagChanged__label'}>
                    { get(data, 'type_data.new_tag') }
                </span>
                <Icon className={'pur-PartupTagChanged__icon'} name={'arrow-left'} />
                <span className={'pur-PartupTagChanged__label'}>
                    { get(data, 'type_data.old_tag') }
                </span>
            </div>
        );
    }
}

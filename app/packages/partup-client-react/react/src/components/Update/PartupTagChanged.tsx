import './PartupTagChanged.css';

import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';
import { Icon } from 'components/Icon/Icon';
import { UpdateDocument } from 'collections/Updates';

interface Props {
    className?: string;
    data: UpdateDocument;
}

export class PartupTagChanged extends React.Component<Props, {}> {

    public render() {
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

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupTagChanged', className, {

        });
    }
}

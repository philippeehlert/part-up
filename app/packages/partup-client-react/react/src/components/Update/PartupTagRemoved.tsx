
import * as React from 'react';
import * as c from 'classnames';
import './PartupTagRemoved.css';
import { get } from 'lodash';

interface Props {
    className?: string;
    data: any;
}

export class PartupTagRemoved extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupTagRemoved', className, {

        });
    }

    render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                <span className={'pur-PartupTagRemoved__label'}>
                    { get(data, 'type_data.old_tag') }
                </span>
            </div>
        );
    }
}

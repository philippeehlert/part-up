import './PartupNameChanged.css';

import * as React from 'react';
import * as c from 'classnames';
import { get } from 'lodash';

interface Props {
    className?: string;
    data: any;
}

export class PartupNameChanged extends React.Component<Props, {}> {

    public render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                { get(data, 'type_data.new_name') }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupNameChanged', className, {

        });
    }
}

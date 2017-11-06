
import * as React from 'react';
import * as c from 'classnames';
import './PartupNameChanged.css';
import { get } from 'lodash';

interface Props {
    className?: string;
    data: any;
}

export default class PartupNameChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupNameChanged', className, {

        });
    }

    render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                { get(data, 'type_data.new_name') }
            </div>
        );
    }
}

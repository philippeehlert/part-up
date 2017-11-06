
import * as React from 'react';
import * as c from 'classnames';
import './PartupDescriptionChanged.css';
import { get } from 'lodash';

interface Props {
    className?: string;
    data: any;
}

export default class PartupDescriptionChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupDescriptionChanged', className, {

        });
    }

    render() {
        const { data } = this.props;

        return (
            <div className={this.getClassNames()}>
                { get(data, 'type_data.new_description') }
            </div>
        );
    }
}

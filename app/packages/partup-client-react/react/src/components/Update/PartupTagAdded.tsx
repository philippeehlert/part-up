
import * as React from 'react';
import * as c from 'classnames';
import './PartupTagAdded.css';
import { get } from 'lodash';

interface Props {
    className?: string;
    data: any;
}

export default class PartupTagAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupTagAdded', className, {

        });
    }

    render() {
        const { data } = this.props;
        
        return (
            <div className={this.getClassNames()}>
                <span className={'pur-PartupTagAdded__label'}>
                    { get(data, 'type_data.new_tag') }
                </span>
            </div>
        );
    }
}

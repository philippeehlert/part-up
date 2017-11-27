
import * as React from 'react';
import * as c from 'classnames';
import './PartupUnarchived.css';

interface Props {
    className?: string;
    data: any;
}

export class PartupUnarchived extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupUnarchived', className, {

        });
    }

    render() {
        return 'no-update-available';
    }
}

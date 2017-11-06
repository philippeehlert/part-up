
import * as React from 'react';
import * as c from 'classnames';
import './PartupArchived.css';

interface Props {
    className?: string;
    data: any;
}

export default class PartupArchived extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupArchived', className, {

        });
    }

    render() {
        return 'no-update-available';
    }
}

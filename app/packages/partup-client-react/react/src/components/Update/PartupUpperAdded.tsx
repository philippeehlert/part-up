
import * as React from 'react';
import * as c from 'classnames';
import './PartupUpperAdded.css';

interface Props {
    className?: string;
    data: any;
}

export class PartupUpperAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupUpperAdded', className, {

        });
    }

    render() {
        return 'no-update-yet';
    }
}

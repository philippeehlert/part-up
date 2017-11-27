
import * as React from 'react';
import * as c from 'classnames';
import './PartupInvited.css';

interface Props {
    className?: string;
    data: any;
}

export class PartupInvited extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupInvited', className, {

        });
    }

    render() {

        return 'no-update-avaiable';
    }
}

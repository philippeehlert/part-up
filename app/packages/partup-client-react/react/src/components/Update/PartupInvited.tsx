
import * as React from 'react';
import * as c from 'classnames';
import './PartupInvited.css';

interface Props {
    className?: string;
}

export default class PartupInvited extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupInvited', className, {

        });
    }

    render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { children }
            </div>
        );
    }
}

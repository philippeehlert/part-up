
import * as React from 'react';
import * as c from 'classnames';
import './PartupPartnerRejected.css';

interface Props {
    className?: string;
}

export default class PartupPartnerRejected extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupPartnerRejected', className, {

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

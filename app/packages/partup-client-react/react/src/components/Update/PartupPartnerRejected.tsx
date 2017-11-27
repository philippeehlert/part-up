
import * as React from 'react';
import * as c from 'classnames';
import './PartupPartnerRejected.css';

interface Props {
    className?: string;
}

export class PartupPartnerRejected extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupPartnerRejected', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_partner_rejected` }
            </div>
        );
    }
}

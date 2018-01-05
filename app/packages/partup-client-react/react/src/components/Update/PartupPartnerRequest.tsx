import './PartupPartnerRequest.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class PartupPartnerRequest extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_partner_request` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupPartnerRequest', className, {

        });
    }
}

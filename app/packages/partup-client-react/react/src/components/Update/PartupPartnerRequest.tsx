
import * as React from 'react';
import * as c from 'classnames';
import './PartupPartnerRequest.css';

interface Props {
    className?: string;
}

export default class PartupPartnerRequest extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupPartnerRequest', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_partner_request` }
            </div>
        );
    }
}

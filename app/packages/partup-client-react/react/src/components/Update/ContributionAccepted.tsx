import './ContributionAccepted.css';

import * as React from 'react';
import * as c from 'classnames';
import { UpdateDocument } from 'collections/Updates';

interface Props {
    className?: string;
    data: UpdateDocument;
}

export class ContributionAccepted extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                {`contribution_accepted`}
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionAccepted', className, {

        });
    }
}

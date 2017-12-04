import './ContributionAdded.css';

import * as React from 'react';
import * as c from 'classnames';
import { UpdateDocument } from 'collections/Updates';

interface Props {
    className?: string;
    data: UpdateDocument;
}

export class ContributionAdded extends React.Component<Props, {}> {

    public render() {
        // tslint:disable-next-line:no-console
        console.log(this.props.data);
        return (
            <div className={this.getClassNames()}>
                {`contribution_added`}
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionAdded', className, {

        });
    }
}

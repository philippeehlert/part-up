import './ContributionAdded.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    data: any;
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

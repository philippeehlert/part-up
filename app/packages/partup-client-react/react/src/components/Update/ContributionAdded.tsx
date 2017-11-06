
import * as React from 'react';
import * as c from 'classnames';
import './ContributionAdded.css';

interface Props {
    className?: string;
    data: any;
}

export default class ContributionAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionAdded', className, {

        });
    }

    render() {
        console.log(this.props.data);
        return (
            <div className={this.getClassNames()}>
                {`contribution_added`}
            </div>
        );
    }
}

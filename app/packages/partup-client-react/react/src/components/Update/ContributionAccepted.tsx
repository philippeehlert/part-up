
import * as React from 'react';
import * as c from 'classnames';
import './ContributionAccepted.css';

interface Props {
    className?: string;
    data: any;
}

export default class ContributionAccepted extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-ContributionAccepted', className, {

        });
    }

    render() {
        console.log(this.props.data);
        return (
            <div className={this.getClassNames()}>
                {`contribution_accepted`}
            </div>
        );
    }
}

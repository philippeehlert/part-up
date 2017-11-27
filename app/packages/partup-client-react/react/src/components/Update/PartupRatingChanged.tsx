
import * as React from 'react';
import * as c from 'classnames';
import './PartupRatingChanged.css';

interface Props {
    className?: string;
}

export class PartupRatingChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupRatingChanged', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_rating_changed` }
            </div>
        );
    }
}

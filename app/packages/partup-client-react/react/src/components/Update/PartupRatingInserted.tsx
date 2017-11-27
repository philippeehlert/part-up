
import * as React from 'react';
import * as c from 'classnames';
import './PartupRatingInserted.css';

interface Props {
    className?: string;
}

export class PartupRatingInserted extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupRatingInserted', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_rating_inserted` }
            </div>
        );
    }
}

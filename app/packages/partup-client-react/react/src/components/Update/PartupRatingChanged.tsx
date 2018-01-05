import './PartupRatingChanged.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class PartupRatingChanged extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `partup_rating_changed` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-PartupRatingChanged', className, {

        });
    }
}


import * as React from 'react';
import * as c from 'classnames';
import './PartupRatingChanged.css';

interface Props {
    className?: string;
}

export default class PartupRatingChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupRatingChanged', className, {

        });
    }

    render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { children }
            </div>
        );
    }
}


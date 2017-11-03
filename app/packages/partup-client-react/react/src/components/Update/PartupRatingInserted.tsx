
import * as React from 'react';
import * as c from 'classnames';
import './PartupRatingInserted.css';

interface Props {
    className?: string;
}

export default class PartupRatingInserted extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupRatingInserted', className, {

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

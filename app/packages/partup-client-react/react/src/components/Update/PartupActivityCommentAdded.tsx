
import * as React from 'react';
import * as c from 'classnames';
import './PartupActivityCommentAdded.css';

interface Props {
    className?: string;
}

export default class PartupActivityCommentAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupActivityCommentAdded', className, {

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



import * as React from 'react';
import * as c from 'classnames';
import './PartupCommentAdded.css';

interface Props {
    className?: string;
}

export default class PartupCommentAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupCommentAdded', className, {

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

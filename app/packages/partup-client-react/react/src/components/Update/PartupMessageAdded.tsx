
import * as React from 'react';
import * as c from 'classnames';
import './PartupMessageAdded.css';

interface Props {
    className?: string;
}

export default class PartupMessageAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupMessageAdded', className, {

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


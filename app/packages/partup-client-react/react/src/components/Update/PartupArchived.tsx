
import * as React from 'react';
import * as c from 'classnames';
import './PartupArchived.css';

interface Props {
    className?: string;
}

export default class PartupArchived extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupArchived', className, {

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

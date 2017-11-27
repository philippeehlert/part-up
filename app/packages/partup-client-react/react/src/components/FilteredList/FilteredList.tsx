import * as React from 'react';
import * as c from 'classnames';
import './FilteredList.css';

interface Props {
    className?: string;
}

export class FilteredList extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-FilteredList', className, {

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

import * as React from 'react';
import * as c from 'classnames';
import './FilteredListItems.css';

interface Props {
    className?: string;
}

export default class FilteredListItems extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-FilteredListItems', className, {

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

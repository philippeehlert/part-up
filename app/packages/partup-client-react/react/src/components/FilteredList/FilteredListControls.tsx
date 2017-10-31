import * as React from 'react';
import * as c from 'classnames';
import './FilteredListControls.css';

interface Props {
    className?: string;
}

export default class FilteredListControls extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-FilteredListControls', className, {

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

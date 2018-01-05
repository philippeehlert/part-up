import './FilteredListItems.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    hasSubSections?: boolean;
}

export class FilteredListItems extends React.Component<Props, {}> {

    public render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { children }
            </div>
        );
    }

    private getClassNames() {
        const { className, hasSubSections } = this.props;

        return c('pur-FilteredListItems', className, {
            'pur-FilteredListItems--has-sub-sections': hasSubSections,
        });
    }
}

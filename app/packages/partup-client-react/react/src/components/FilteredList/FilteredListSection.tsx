import './FilteredListSection.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    title?: string;
}

export class FilteredListSection extends React.Component<Props, {}> {

    public render() {
        const {
            children,
            title,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                {title && <div className={`pur-FilteredListSection__title`}>{title}</div>}
                <div className={`pur-FilteredListSection__content`}>
                    {children}
                </div>
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-FilteredListSection', {
            // 'pur-FilteredListSeperator--modifier-class': boolean,
        }, className);
    }
}

import './HTMLText.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    wrapComponent?: any;
    html: string;
}

export class HTMLText extends React.Component<Props, {}> {

    public render() {
        const { html } = this.props;
        const Wrap = this.getComponent();

        return (
            <Wrap
            className={this.getClassNames()}
            dangerouslySetInnerHTML={{ __html: html }} />
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-HTMLText', className, {

        });
    }

    private getComponent() {
        const { wrapComponent } = this.props;

        if (wrapComponent) return wrapComponent;

        return 'span';
    }
}

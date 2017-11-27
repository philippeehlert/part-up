import './Icon.css';

import * as React from 'react';
import * as c from 'classnames';

import * as icons from 'static/icons.json';

interface Props {
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    name: string;
}

export class Icon extends React.Component<Props, {}> {

    public render() {
        const { name } = this.props;

        return (
            <i
            className={this.getClassNames()}
            onClick={this.onClick}
            dangerouslySetInnerHTML={{ __html: icons[name] }} />
        );
    }

    private onClick = (event: React.MouseEvent<HTMLElement>) => {
        const { onClick } = this.props;

        if (onClick) onClick(event);
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Icon', className, {

        });
    }
}

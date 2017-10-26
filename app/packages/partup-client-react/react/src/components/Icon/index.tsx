import * as React from 'react';
import * as c from 'classnames';

import * as icons from 'static/icons.json';

import './Icon.css';

interface Props {
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    name: string;
}

export default class Icon extends React.Component<Props, {}> {

    static defaultProps = {

    };

    onClick = (event: React.MouseEvent<HTMLElement>) => {
        const { onClick } = this.props;
    
        if (onClick) onClick(event);
    }

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Icon', className, {

        });
    }

    render() {
        const { name } = this.props;

        return (
            <i
                className={this.getClassNames()}
                onClick={this.onClick}
                dangerouslySetInnerHTML={{__html: icons[name]}} />
        );
    }
}

import * as React from 'react';
import * as c from 'classnames';
import './Clickable.css';

interface Props {
    className?: string;
    onClick: Function;
}

export default class Clickable extends React.Component<Props, {}> {

    static defaultProps = {

    };

    onClick = (event: React.SyntheticEvent<any>) => {
        const { onClick } = this.props;

        if (onClick) onClick(event);
    }

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Clickable', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <button type="button" className={this.getClassNames()} onClick={this.onClick}>
                {children}
            </button>
        );
    }
}

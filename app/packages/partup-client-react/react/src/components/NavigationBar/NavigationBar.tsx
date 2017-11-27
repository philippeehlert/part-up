import * as React from 'react';
import * as c from 'classnames';
import './NavigationBar.css';

interface Props {
    className?: string;
}

export class NavigationBar extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-NavigationBar', className, {

        });
    }

    render() {
        const { children } = this.props;

        return (
            <div className={this.getClassNames()}>
                {children}
            </div>
        );
    }
}

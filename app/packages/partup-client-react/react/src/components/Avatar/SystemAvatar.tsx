import * as React from 'react';
import * as c from 'classnames';
import './SystemAvatar.css';

interface Props {
    className?: string;
}

export default class SystemAvatar extends React.Component<Props, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-SystemAvatar', className, {

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

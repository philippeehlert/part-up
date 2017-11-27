import * as React from 'react';
import * as c from 'classnames';
import './ModalWindow.css';

interface Props {
    className?: string;
}
export class ModalWindow extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-ModalWindow', className, {

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

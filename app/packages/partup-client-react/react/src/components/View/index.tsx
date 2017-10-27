import * as React from 'react';
import * as c from 'classnames';
import './View.css';

interface Props {
    className?: string;
}

export default class View extends React.Component<Props, {}> {

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-View', className, {

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

export { default as ContentView } from './ContentView';

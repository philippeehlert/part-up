
import * as React from 'react';
import * as c from 'classnames';
import './PartupUpperAdded.css';

interface Props {
    className?: string;
}

export default class PartupUpperAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupUpperAdded', className, {

        });
    }

    render() {
        const {
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                { children }
            </div>
        );
    }
}


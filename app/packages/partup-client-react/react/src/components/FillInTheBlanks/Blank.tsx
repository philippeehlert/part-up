import * as React from 'react';
import * as c from 'classnames';
import './Blank.css';

interface Props {
    label: string;
    className?: string;
}

export default class Blank extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-Blank', className, {

        });
    }

    render() {
        const {
            label,
            children,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-Blank__label`}>{ label }</div>
                { children }
            </div>
        );
    }
}

import * as React from 'react';
import * as c from 'classnames';
import './Input.css';

interface Props {
    className?: string;
    type: string;
    name: string;
}

export default class Input extends React.Component<Props, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Input', className, {

        });
    }

    render() {
        const { type, name } = this.props;

        return (
            <input type={type} name={name} className={this.getClassNames()} />
        );
    }
}

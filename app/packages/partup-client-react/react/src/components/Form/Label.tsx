import * as React from 'react';
import * as c from 'classnames';
import './Label.css';

interface Props {
    className?: string;
    label: string;
}

export default class Label extends React.Component<Props, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Label', className, {

        });
    }

    render() {
        const { children, label } = this.props;

        return (
            <label className={this.getClassNames()}>
                <div className={'pur-Label__text'}>
                    {label}
                </div>
                <div className={'pur-Label__input'}>
                    {children}
                </div>
            </label>
        );
    }
}

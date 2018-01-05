import './Label.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    label: string;
}

export class Label extends React.Component<Props, {}> {

    public render() {
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

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Label', className, {

        });
    }
}

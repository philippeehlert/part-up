import './Row.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export const Row: React.SFC<Props> = ({ children, className }) => {
    const classNames = c('pur-Row', {}, className);

    return (
        <div className={classNames}>
            {children}
        </div>
    );
};

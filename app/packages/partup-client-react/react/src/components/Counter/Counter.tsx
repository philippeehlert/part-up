import './Counter.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    count: number;
}

export const Counter: React.SFC<Props> = ({ count, className }) => {
    const classNames = c('pur-Counter', {}, className);

    return (
        <span className={classNames}>
            {count ? count : null}
        </span>
    );
};

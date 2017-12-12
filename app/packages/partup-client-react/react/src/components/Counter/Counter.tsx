import './Counter.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
    count: number;
    highlighted?: boolean;
}

export const Counter: React.SFC<Props> = ({ count, className, highlighted }) => {
    const classNames = c('pur-Counter', {
        'pur-Counter--highlighted': highlighted,
    }, className);

    return (
        <span className={classNames}>
            {count ? count : null}
        </span>
    );
};

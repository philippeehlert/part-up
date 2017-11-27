import './Rated.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    className?: string;
}

export class Rated extends React.Component<Props, {}> {

    public render() {
        return (
            <div className={this.getClassNames()}>
                { `rated` }
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Rated', className, {

        });
    }
}

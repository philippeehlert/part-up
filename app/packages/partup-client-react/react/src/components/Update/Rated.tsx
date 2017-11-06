
import * as React from 'react';
import * as c from 'classnames';
import './Rated.css';

interface Props {
    className?: string;
}

export default class Rated extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-Rated', className, {

        });
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                { `rated` }
            </div>
        );
    }
}

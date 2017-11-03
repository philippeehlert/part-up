
import * as React from 'react';
import * as c from 'classnames';
import './PartupDescriptionChanged.css';

interface Props {
    className?: string;
}

export default class PartupDescriptionChanged extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupDescriptionChanged', className, {

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

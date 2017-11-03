
import * as React from 'react';
import * as c from 'classnames';
import './PartupSupporterAdded.css';

interface Props {
    className?: string;
}

export default class PartupSupporterAdded extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-PartupSupporterAdded', className, {

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

import * as React from 'react';
import * as c from 'classnames';
import './UpdateTileContent.css';

interface Props {
    className?: string;
}

export class UpdateTileContent extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileContent', className, {

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

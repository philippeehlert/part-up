import * as React from 'react';
import * as c from 'classnames';
import './UpdateTile.css';

interface Props {
    className?: string;
}

export default class UpdateTile extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTile', className, {

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

export { default as UpdateTileMeta } from './UpdateTileMeta';
export { default as UpdateTileContent } from './UpdateTileContent';
export { default as UpdateTileComments } from './UpdateTileComments';

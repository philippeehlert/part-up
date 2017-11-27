import './Tile.css';

import * as React from 'react';
import * as c from 'classnames';

interface Props {
    title: JSX.Element|string;
    className?: string;
}

export class Tile extends React.Component<Props, {}> {

    public render() {
        const {
            children,
            title,
        } = this.props;

        return (
            <div className={this.getClassNames()}>
                <h4 className={`pur-Tile__title`}>{ title }</h4>
                <div className={`pur-Tile__content`}>
                    { children }
                </div>
            </div>
        );
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-Tile', className, {

        });
    }
}

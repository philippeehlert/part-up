import * as React from 'react';
import * as c from 'classnames';
import './Tile.css';

interface Props {
    title: JSX.Element|string;
    className?: string;
}

export class Tile extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-Tile', className, {

        });
    }

    render() {
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
}

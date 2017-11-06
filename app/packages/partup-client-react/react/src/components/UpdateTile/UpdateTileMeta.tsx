import * as React from 'react';
import * as c from 'classnames';
import * as moment from 'moment';
import './UpdateTileMeta.css';

// import { Link } from '../Router';

interface Props {
    className?: string;
    postedAt: Date|string;
    avatar: JSX.Element;
}

export default class UpdateTileMeta extends React.Component<Props, {}> {

    getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileMeta', className, {

        });
    }

    render() {
        const { postedAt, children, avatar } = this.props;

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileMeta__author-avatar`}>
                    {avatar}
                </div>
                <div className={`pur-UpdateTileMeta__pur-UpdateTileMeta__info`}>
                    <h4 className={`pur-UpdateTileMeta__created-info`}>
                        { children }
                    </h4>
                    <time
                        className={`pur-UpdateTileMeta__created-at`}
                        dateTime={postedAt.toString()}
                    >
                        { moment(postedAt).format('H:mm ddd MMMM YYYY') }
                    </time>
                </div>
            </div>
        );
    }
}

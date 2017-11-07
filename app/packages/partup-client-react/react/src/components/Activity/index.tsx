import * as React from 'react';
import * as c from 'classnames';
import './Activity.css';
import { get } from 'lodash';
import Partups from 'collections/Partups';

import { Link } from 'components/Router';

interface Props {
    className?: string;
    _id: string;
    data: any;
}

export default class Activity extends React.Component<Props, {}> {

    static defaultProps = {

    };

    getClassNames = () => {
        const { className } = this.props;

        return c('pur-Activity', className, {

        });
    }

    render() {
        const { _id, data } = this.props;

        if (!data) return this.renderDeleted();

        const lane = get(data, 'lane');
        const partupSlug = Partups.getSlug(data.partup_id);

        return (
            <div className={this.getClassNames()}>
                <div className={'pur-Activity__header'}>
                    { lane && (
                        <span className={'pur-Activity__header__lane'}>
                            { get(lane, 'name') }
                        </span>
                    ) }
                    <Link
                        className={'pur-Activity__header__title-link'}
                        to={`/partups/${partupSlug}/updates/${_id}`}
                        target={'_partup'}>
                        { data.name }
                    </Link>
                </div>
                { data.description && (
                    <div className={`pur-Activity__content`}>
                        { data.description }
                    </div>
                ) }
            </div>
        );
    }

    private renderDeleted = () => (
        <div className={this.getClassNames()}>
            <span className={'pur-Activity__deleted-label'}>This activity is deleted...</span>
        </div>
    )
}

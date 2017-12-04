import * as React from 'react';
import * as c from 'classnames';
import './Activity.css';
import { get } from 'lodash';
import { Partups } from 'collections/Partups';

import { Link } from 'components/Router/Link';
import { Activities, ActivityDocument } from 'collections/Activities';

interface Props {
    className?: string;
    _id: string;
}

interface State {
    activity: ActivityDocument | undefined;
}

export class Activity extends React.Component<Props, State> {

    public state: State = {
        activity: undefined,
    };

    public componentWillMount() {
        const activity = Activities.findOneStatic({ _id: this.props._id });

        this.setState({
            activity,
        });
    }

    public render() {
        const { _id } = this.props;
        const { activity } = this.state;

        if (!activity) return this.renderDeleted();

        const lane = get(activity, 'lane');
        const partupSlug = Partups.getSlugById(activity.partup_id);

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
                        { activity.name }
                    </Link>
                </div>
                { activity.description && (
                    <div className={`pur-Activity__content`}>
                        { activity.description }
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

    private getClassNames = () => {
        const { className } = this.props;

        return c('pur-Activity', className, {

        });
    }
}
